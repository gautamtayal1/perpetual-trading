import { Fill, Order } from "@repo/types"
import { v4 as uuidv4 } from "uuid"

export class Orderbook {
  bids: Order[]
  asks: Order[]
  market: string

  constructor(
    bids: Order[],
    asks: Order[],
    market: "BTCUSDT"
  ) {
    this.bids = bids
    this.asks = asks
    this.market = market

    this.sortOrders()
  }

  getSnapshot () {
    return {
      bids: this.bids,
      asks: this.asks,
      market: this.market,
    };
  }

  private sortOrders () {
    this.bids.sort((a, b) => b.entryPrice - a.entryPrice)
    this.asks.sort((a, b) => a.entryPrice - b.entryPrice)
  }


  addOrder (order: Order) {
    console.log("inside addorder")
    if (order.side === "LONG") {
      const {executedQty, fills} = this.matchBid(order)

      if (executedQty < order.quantity) {
        this.bids.push({...order, filled: executedQty})
        this.sortOrders()
      }
      return { executedQty, fills }

    } else {
      const {executedQty, fills} = this.matchAsk(order)
      if (executedQty < order.quantity) {
        this.bids.push({...order, filled: executedQty})
        this.sortOrders()
      }
      return { executedQty, fills }
    }
  }

  matchAsk (order: Order) {
    let executedQty = 0
    let fills: Fill[] = []

    for(let i = 0; i < this.bids.length; i++) {
      const bid = this.bids
      if (order.entryPrice > bid[i]?.entryPrice! && executedQty) {
        const traded = Math.min(bid[i]?.quantity!, order.quantity - executedQty)
        executedQty += traded
        //@ts-ignore
        bid[i]?.filled += traded

        fills.push({
          fillId: uuidv4(),
          orderId: order.id!,
          userId: order.userId,
          otherUserId: bid[i]?.userId!,
          price: order.entryPrice,
          quantity: traded
        })
      }
    }
    this.bids = this.bids.filter((bid) => bid.filled < bid.quantity)
    return { executedQty, fills }
  }

  matchBid (order: Order) {
    let executedQty = 0
    let fills: Fill[] = []

    for(let i = 0; i < this.asks.length; i++) {
      const ask = this.asks
      if (order.entryPrice > ask[i]?.entryPrice! && executedQty) {
        const traded = Math.min(ask[i]?.quantity!, order.quantity - executedQty)
        executedQty += traded
        //@ts-ignore
        ask[i]?.filled += traded

        fills.push({
          fillId: uuidv4(),
          orderId: order.id!,
          userId: order.userId,
          otherUserId: ask[i]?.userId!,
          price: order.entryPrice,
          quantity: traded
        })
      }
    }
    this.asks = this.asks.filter((ask) => ask.filled < ask.quantity)
    return { executedQty, fills }
  }

  getMarketDepth () {
    const bidDepth = this.aggregateByPrice(this.bids, true)
    const askDepth = this.aggregateByPrice(this.asks, false)

    return {
      ask: askDepth,
      bid: bidDepth,
    }
  }

  aggregateByPrice (orders: Order[], descending: boolean = true) {
    const priceMap = new Map()

    orders.forEach((order) => {
      if(order.quantity > 0) {
        priceMap.set(order.entryPrice, (priceMap.get(order.entryPrice) || 0) + order.quantity)
      }
    })

    const entries = Array.from(priceMap.entries())
    .map(([price, quantity]) => [price.toString(), quantity.toString()]);
    
    return descending 
      ? entries.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))  
      : entries.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  }

  getOpenOrders (userId: string) {
    const userBids = this.bids.filter((bid) => bid.userId === userId)
    const userAsks = this.asks.filter((ask) => ask.userId === userId)

    return [...userAsks, ...userBids]
  }

  cancelOrder(orderId: string, userId: string) {
    const bidIndex = this.bids.findIndex((bid) => bid.userId === userId && bid.id === orderId)
    if(bidIndex !== -1) {
      this.bids.splice(bidIndex, 1)
      console.log("order cancelled")
    }
    const askIndex = this.asks.findIndex((ask) => ask.userId === userId && ask.id === orderId)
    if(askIndex !== -1) {
      this.asks.splice(askIndex, 1)
      console.log("order cancelled")
    }
  }
}