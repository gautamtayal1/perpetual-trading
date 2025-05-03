import { eventQueue, RedisManager } from "@repo/event-queue"
import { Orderbook } from "./Orderbook.js"
import { S3Manager } from "./S3Manager.js"
import { Fill, Order, OrderSide, UserBalance, UserPosition } from "@repo/types"
import { v4 as uuidv4 } from "uuid" 
import { Worker } from "bullmq"

const ENGINE_KEY = "prod-snapshot.json"

export class Engine {
  public static instance: Engine | null = null
  private orderbook: Orderbook | null
  private userPosition: Map<String, UserPosition> = new Map()
  private userBalance: Map<String, UserBalance> = new Map()

  private constructor() {
    this.orderbook = null
    this.startWorker()
  } 

  public static getInstance(): Engine {
    if(!this.instance) {
      this.instance = new Engine()
    }
    return this.instance
  }

  static async create() {
    if (this.instance) return this.instance

    const engine = new Engine()
    try {
      const snapshot = await S3Manager.downloadSnapshot(ENGINE_KEY)
      if (snapshot) {
        const snapBook = snapshot.orderbook
        engine.orderbook = new Orderbook(snapBook.bids, snapBook.asks, snapBook.market)
        if (snapshot.userPosition) {
          for(const [userId, position] of snapshot.userPosition) {
            engine.userPosition.set(userId, position)
          }
        }
        if (snapshot.userBalance) {
          for(const [userId, balance] of snapshot.userBalance) {
            engine.userBalance.set(userId, balance)
          }
        }
      } else {
        engine.orderbook = new Orderbook([], [], "BTCUSDT")
      }

    } catch (error) {
      console.log("Engine creation failed: ", error)
      Engine.instance = null
      throw error
    }
    setInterval(() => {
      engine.saveSnapshot()
    }, 3000);
    return engine
  }

   startWorker() {
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
      throw new Error("Missing REDIS_HOST or REDIS_PORT in env");
    }
    new Worker("FUNDING_QUEUE", async (job) => {
      if (job.data.fundingRate && job.data.markPrice){
        this.applyFunding(job.data.fundingRate, job.data.markPrice)
      }
    }, {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }
    })
  }

  private async saveSnapshot () {
    const snapshot = {
      orderbook: this.orderbook?.getSnapshot(),
      userPosition: Array.from(this.userPosition.entries()),
      userBalance: Array.from(this.userBalance.entries())
    }
    await S3Manager.uploadSnapshot(snapshot, ENGINE_KEY)
  }

  processOrder(order: Order) {
    console.log("engine processing order: ", order)

    switch(order.type) {
      case "LIMIT-CREATE":
        try {
          this.createOrder(
            order.userId,
            order.entryPrice,
            order.quantity,
            order.side,
            order.leverage
          )
        } catch (error) {
          console.log(error)
        }

        break
      case "LIMIT-CANCEL":
        this.orderbook?.cancelOrder(order.id!, order.userId)

        const remainingQuantity = order.quantity - order.filled
        const userBalance = this.userBalance.get(order.userId)

        if (userBalance) {
          userBalance.availableBalance += remainingQuantity * order.entryPrice
          userBalance.lockedBalance -= remainingQuantity * order.entryPrice

          this.publishDepthForCancel(order.entryPrice.toString())
          this.publishUserBalance(order.userId)
          this.publishOrderCancelled(order.id!)
          this.updateRedisBalance(order.userId)
          this.updateRedisDepth()
          this.cancelRedisOrder(order)
        }
        break
      case "MARKET-CREATE":
        try {
          this.createMarketOrder(
            order.userId,
            order.quantity,
            order.side,
            order.leverage
          )
        } catch (error) {
          console.log(error)
        }
        break
      case "MARKET-LIQUIDATE":
        try {
          this.createMarketOrder(
            order.userId,
            order.quantity,
            order.side,
            order.leverage
          )
        } catch (error) {
          console.log(error)
        }
        break
    }
    console.log("order processed, moving to liquidator")
    this.updateTopOfBook()
    this.positionUpdateForLiquidation()
    
  }
  
  createOrder(
    userId: string, 
    entryPrice: number, 
    quantity: number, 
    side: OrderSide, 
    leverage: number
  ) {
    console.log("create order entered")
    this.ensureUser(userId)
    this.checkAndLockBalance(userId, entryPrice, quantity, leverage, side)

    const orderId = uuidv4()
    const order = {
      id: orderId,
      userId,
      side,
      entryPrice, 
      quantity,
      leverage,
      filled: 0
    }
    const { executedQty, fills } = this.orderbook?.addOrder(order) ?? { executedQty: 0, fills: [] }

    this.updateUserPnl(fills, executedQty, order)
    this.updateUserPosition(fills, executedQty, order)
    this.publishUserBalance(order.userId)
    this.publishLastTrade(fills)
    this.publishDepth()
    this.updateRedisBalance(order.userId)
    this.updateRedisDepth()
    this.updateRedisOrder(order)
    this.updateRedisFills(fills, order)
    this.updateRedisPosition(fills, order)
    console.log(executedQty, fills)
  }

  createMarketOrder(
    userId: string,
    quantity: number,
    side: OrderSide,
    leverage: number
  ) {
    console.log("create order entered")
    this.ensureUser(userId)
    
    const referencePrice = this.orderbook?.getBestOppositePrice(side, quantity)
    if (!referencePrice) {
      throw new Error("No reference price found")
    }
    this.checkAndLockBalance(userId, referencePrice, quantity, leverage, side)

    const orderId = uuidv4()
    const order = {
      id: orderId,
      userId,
      side,
      entryPrice: referencePrice,
      quantity,
      leverage,
      filled: 0
    }
    
    const { executedQty, fills } = this.orderbook?.addOrder(order) ?? { executedQty: 0, fills: [] }

    this.updateUserPnl(fills, executedQty, order)
    this.updateUserPosition(fills, executedQty, order)
    this.publishUserBalance(order.userId)
    this.publishLastTrade(fills)
    this.publishDepth()
    this.updateRedisBalance(userId)
    this.updateRedisDepth()
    this.updateRedisOrder(order)
    this.updateRedisFills(fills, order)
    this.updateRedisPosition(fills, order)
  }

  ensureUser(userId: string) {
    if (!this.userBalance.has(userId)) {
      this.userBalance.set(userId, {
        availableBalance: 1000000,
        lockedBalance: 0
      })
    }
    if (!this.userPosition.has(userId)) {
      this.userPosition.set(userId, {
        side: "UNINITIALIZED",
        quantity: 0,
        entryPrice: 0,
        margin: 0,
        unrealizedPnl: 0,
        liquidatedPrice: 0,
        market: "BTCUSDT"
      });
    }
  }
  
  checkAndLockBalance(
    userId: string, 
    price: number, 
    quantity: number, 
    leverage: number,
    side: OrderSide
  ) {
    const userPosition = this.userPosition.get(userId)
    const balance = this.userBalance.get(userId)!
    
    if (side === "LONG") {
      switch (userPosition?.side) {
        case "LONG" : 
        const marginRequired = (price * quantity) / leverage
        if(balance.availableBalance < marginRequired) {
          throw new Error("Insufficient Balance")
        }
          balance.availableBalance -= marginRequired
          balance.lockedBalance += marginRequired
        break;

        case "SHORT" : 
          if (userPosition.quantity < quantity) {
            const marginRequired = (price * (quantity - userPosition.quantity)) / leverage
            balance.availableBalance -= marginRequired
            balance.lockedBalance += marginRequired
          }
          
        break;
        case "UNINITIALIZED":{
          const marginRequired = (price * quantity) / leverage
          if(balance.availableBalance < marginRequired) {
            throw new Error("Insufficient Balance")
          }
          balance.availableBalance -= marginRequired
          balance.lockedBalance += marginRequired
          break;
        }
          
      }
    }

    if (side === "SHORT") {
      switch (userPosition?.side) {
        case "SHORT" : 
        const marginRequired = (price * quantity) / leverage
        if(balance.availableBalance < marginRequired) {
          throw new Error("Insufficient Balance")
        }
          balance.availableBalance -= marginRequired
          balance.lockedBalance += marginRequired
        break;

        case "LONG" : 
          if (userPosition.quantity < quantity) {
            const marginRequired = (price * (quantity - userPosition.quantity)) / leverage
            balance.availableBalance -= marginRequired
            balance.lockedBalance += marginRequired
          }
        break;
        case "UNINITIALIZED" :{
          const marginRequired = (price * quantity) / leverage
          if(balance.availableBalance < marginRequired) {
            throw new Error("Insufficient Balance")
          }
          balance.availableBalance -= marginRequired
          balance.lockedBalance += marginRequired
          break;
        }
      }
    } 
  }

  updateUserPnl (
    fills: Fill[], 
    executedQty: number,
    order: Order
  ) {
    const userPosition = this.userPosition.get(order.userId)
    const userSide = userPosition?.side
    const orderSide = order.side
    const userBalance = this.userBalance.get(order.userId)!

    if (!fills.length) return
    if (userSide === "LONG" && orderSide === "SHORT" ) {
      const pnl = (fills[0]?.price! - userPosition?.entryPrice!) * executedQty

      userBalance.availableBalance += ((userPosition?.entryPrice! / order.leverage) * Math.min(userPosition?.quantity!, executedQty)) + pnl

      userBalance.lockedBalance -= (userPosition?.entryPrice! / order.leverage) * Math.min(userPosition?.quantity!, executedQty)
    } 
    
    if(orderSide === "LONG" && userSide === "SHORT") {
      const pnl = (userPosition?.entryPrice! - fills[0]?.price!) * executedQty

      userBalance.availableBalance += ((userPosition?.entryPrice! / order.leverage) * Math.min(userPosition?.quantity!, executedQty)) + pnl

      userBalance.lockedBalance -= (userPosition?.entryPrice! / order.leverage) * Math.min(userPosition?.quantity!, executedQty)
    }
  }

  updateUserPosition (
    fills: Fill[],
    executedQty: number,
    order: Order,
  ) {
    const userPosition = this.userPosition.get(order.userId)
    switch(userPosition?.side) {
      case "SHORT":
        if (order.side === "SHORT") {
          
          const oldNotional = userPosition.entryPrice * userPosition.quantity
          const newNotional = order.entryPrice * executedQty
          const totalQuantity = userPosition.quantity + executedQty
          
          userPosition.quantity += executedQty
          userPosition.entryPrice = (oldNotional + newNotional) / totalQuantity

          const newMargin = (order.entryPrice * executedQty) / order.leverage
          userPosition.margin = userPosition.margin + newMargin
        } else {
          
          if(userPosition.quantity < executedQty) {
            const remainingQty = executedQty - userPosition.quantity
            userPosition.side = "LONG"
            userPosition.quantity = remainingQty
            userPosition.margin = (order.entryPrice * remainingQty) / order.leverage
            userPosition.entryPrice = order.entryPrice
          }
          
          if (userPosition.quantity > executedQty) {
            
            const oldNotional = userPosition.entryPrice * userPosition.quantity
            const newNotional = order.entryPrice * executedQty
            const totalQuantity = userPosition.quantity - executedQty
            
            userPosition.entryPrice = (oldNotional - newNotional) / totalQuantity
            userPosition.quantity -= executedQty

            const newMargin = (order.entryPrice * executedQty) / order.leverage
            userPosition.margin = userPosition.margin - newMargin
          }

          if (userPosition.quantity === executedQty) {
            userPosition.side = "UNINITIALIZED"
            userPosition.quantity = 0
            userPosition.margin = 0
            userPosition.entryPrice = 0
          }
        }
        
      break
      case "LONG":
        if (order.side === "LONG") {
          
          const oldNotional = userPosition.entryPrice * userPosition.quantity
          const newNotional = order.entryPrice * executedQty
          const totalQuantity = userPosition.quantity + executedQty
          
          userPosition.quantity += executedQty
          userPosition.entryPrice = (oldNotional + newNotional) / totalQuantity

          const newMargin = (order.entryPrice * executedQty) / order.leverage
          userPosition.margin = userPosition.margin + newMargin
        } else {
          
          if(userPosition.quantity < executedQty) {
            const remainingQty = executedQty - userPosition.quantity
            userPosition.side = "SHORT"
            userPosition.quantity = remainingQty
            userPosition.margin = (order.entryPrice * remainingQty) / order.leverage
            userPosition.entryPrice = order.entryPrice
          }
          
          if (userPosition.quantity > executedQty) {

            const oldNotional = userPosition.entryPrice * userPosition.quantity
            const newNotional = order.entryPrice * executedQty
            const totalQuantity = userPosition.quantity + executedQty

            userPosition.quantity -= executedQty

            userPosition.entryPrice = (oldNotional - newNotional) / totalQuantity

            const newMargin = (order.entryPrice * executedQty) / order.leverage
            userPosition.margin = userPosition.margin - newMargin
          }

          if (userPosition.quantity === executedQty) {
            userPosition.side = "UNINITIALIZED"
            userPosition.quantity = 0
            userPosition.margin = 0
            userPosition.entryPrice = 0
          }
        }
      break
      default:
        if (executedQty && userPosition) {
          userPosition.side = order.side
          userPosition.entryPrice = order.entryPrice
          userPosition.quantity = executedQty
          userPosition.margin = (order.entryPrice * order.quantity) / order.leverage
        } 
      break
    }

    fills.forEach((fill) => {
      const userPosition = this.userPosition.get(fill.otherUserId)

      switch (userPosition?.side) {
        case "LONG":
          if (order.side === "SHORT") {
            const oldNotional = userPosition.entryPrice * userPosition.quantity
            const newNotional = fill.price * fill.quantity
            const totalQuantity = userPosition.quantity + fill.quantity
            
            userPosition.entryPrice = (oldNotional + newNotional) / totalQuantity
            userPosition.quantity += fill.quantity

            const newMargin = (fill.price * fill.quantity) / order.leverage
            userPosition.margin = userPosition.margin + newMargin
          } else {
            if (userPosition.quantity > fill.quantity) {
              const oldNotional = userPosition.entryPrice * userPosition.quantity
              const newNotional = fill.price * fill.quantity
              const totalQuantity = userPosition.quantity - fill.quantity
              
              userPosition.entryPrice = (oldNotional - newNotional) / totalQuantity

              userPosition.quantity -= fill.quantity
              const newMargin = (fill.price * fill.quantity) / order.leverage
              userPosition.margin = userPosition.margin - newMargin
            } 
            if (userPosition.quantity === fill.quantity) {
              userPosition.side = "UNINITIALIZED"
              userPosition.quantity = 0
              userPosition.margin = 0
              userPosition.entryPrice = 0
            }
          }
          break;
        case "SHORT":
          if (order.side === "LONG") {
            const oldNotional = userPosition.entryPrice * userPosition.quantity
            const newNotional = fill.price * fill.quantity
            const totalQuantity = userPosition.quantity + fill.quantity
            
            userPosition.entryPrice = (oldNotional + newNotional) / totalQuantity
            userPosition.quantity += fill.quantity

            const newMargin = (fill.price * fill.quantity) / order.leverage
            userPosition.margin = userPosition.margin + newMargin

          } else {
            if (userPosition.quantity > fill.quantity) {
              const oldNotional = userPosition.entryPrice * userPosition.quantity
              const newNotional = fill.price * fill.quantity
              const totalQuantity = userPosition.quantity - fill.quantity
              
              userPosition.entryPrice = (oldNotional - newNotional) / totalQuantity
              userPosition.quantity -= fill.quantity

              const newMargin = (fill.price * fill.quantity) / order.leverage
              userPosition.margin = userPosition.margin - newMargin
            }
            if (userPosition.quantity === fill.quantity) {
              userPosition.side = "UNINITIALIZED"
              userPosition.quantity = 0
              userPosition.margin = 0
              userPosition.entryPrice = 0
            }
          }
          break;
        default:
          if (userPosition) {
            userPosition.side = order.side === "LONG" ? "SHORT" : "LONG"
            userPosition.entryPrice = fill.price
            userPosition.quantity = fill.quantity
            userPosition.margin = (fill.price * fill.quantity) / order.leverage
          }
          break;
      }
    })
    //todo: update leverage
  }

  publishUserBalance (userId: string) {
    const userBalance = this.userBalance.get(userId)
    if (userBalance) {
      RedisManager.getInstance().publishToChannel(`balance@${userId}`, {
        data: {
          a: userBalance.availableBalance,
          l: userBalance.lockedBalance
        }
      })
    }
  }

  publishLastTrade (fills: Fill[]) {
   const lastFill = fills[fills.length - 1]
   RedisManager.getInstance().publishToChannel(`trade:update`, {
    data: {
      p: lastFill?.price,
      q: lastFill?.quantity,
    }
   })
  }

  publishDepth () {
    console.log("publishing depth")
    const { asks, bids } = this.orderbook?.getMarketDepth() ?? { asks: [], bids: [] }
    RedisManager.getInstance().publishToChannel(`depth:update`, {
      data: {
        a: asks,
        b: bids,
      }
    })
    console.log("depth published")
  }

  updateRedisBalance (userId: string) {
    const balance = this.userBalance.get(userId)
    eventQueue.add("update_balance", {
      type: "BALANCE_UPDATE",
      data: {
        userId,
        balance: balance?.availableBalance
      }
    })
  }

  updateRedisDepth () {
    const { asks, bids } = this.orderbook?.getMarketDepth() ?? { asks: [], bids: [] }
    eventQueue.add("update_depth", {
      type: "DEPTH_UPDATE",
      data: {
        asks,
        bids,
      }
    })
  }

  updateRedisOrder (order: Order) {
    eventQueue.add("update_order", {  
      type: "ORDER_UPDATE",
      data: order
    })
  }

  updateRedisFills (fills: Fill[], order: Order) {
    fills.forEach((fill) => {
      eventQueue.add("update_fills", {
        type: "FILL_UPDATE",
        data: {
          ...fill,
          side: order.side
        }
      })
    })
  }

  updateRedisPosition (
    fills: Fill[],
    order: Order
  ) {
    const userPosition = this.userPosition.get(order.userId)
    eventQueue.add("update_position", {
      type: "POSITION_UPDATE",
      data: {
        ...userPosition,
        userId: order.userId
      }
    })

    fills.forEach((fill) => {
      const userPosition = this.userPosition.get(fill.otherUserId)
      eventQueue.add("update_fills", {
        type: "POSITION_UPDATE",
        data: {
          ...userPosition,
          userId: fill.otherUserId
        }
      })
    })
  }

  updateTopOfBook () {
    const { asks, bids } = this.orderbook?.getMarketDepth() ?? { asks: [], bids: [] }
    RedisManager.getInstance().publishToChannel(`topOfBook:update`, {
      data: {
        a: asks[0] ?? ["0", "0"],
        b: bids[0] ?? ["0", "0"]
      }
    })
  }

  positionUpdateForLiquidation () {
    const payload = Array.from(this.userPosition.entries()).map(
      ([userId, position]) => ({ userId, ...position, leverage: position.leverage })
    );
    RedisManager.getInstance().publishToChannel("position:update", {
      data: payload
    })
  }

  applyFunding (fundingRate: number, markPrice: number) {
    console.log("applying funding from engine")
    console.log(fundingRate, markPrice, "from engine")
    for (const position of this.userPosition.values()) {
      console.log("entering for loop")
      console.log("position: ", position)
      const side = position.side
      const quantity = position.quantity
      console.log("side: ", side)
      console.log("quantity: ", quantity)
      const fundingPayment = markPrice * quantity * fundingRate
      if (side === "UNINITIALIZED") continue
      if (side === "LONG") {
        console.log("fundingPayment: ", fundingPayment)
        position.margin -= fundingPayment
      } else {
        console.log("fundingPayment: ", fundingPayment)
        position.margin += fundingPayment
      }
    }
  }

  publishDepthForCancel(price: string) {
    const { bids, asks } = this.orderbook!.getMarketDepth()
    const updatedBids = bids.filter((b) => b[0] === price)
    const updatedAsks = asks.filter((a) => a[0] === price)

    RedisManager.getInstance().publishToChannel("depth:update", {
      data: {
        a: updatedAsks.length ? updatedAsks : [[price, "0"]],
        b: updatedBids.length ? updatedBids : [[price, "0"]],
      }
    })
  }

  cancelRedisOrder (order: Order) {
    eventQueue.add("cancel_order", {  
      type: "CANCEL_ORDER",
      data: {
        orderId: order.id
    }
  })}
  
  publishOrderCancelled (orderId: string) {
    RedisManager.getInstance().publishToChannel(`order:cancelled`, {
      data: {
        orderId
      }
    })
  }
}
     