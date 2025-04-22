import { Orderbook } from "./Orderbook.js"
import { S3Manager } from "./S3Manager.js"
import { Order, OrderbookType, UserPosition } from "./types.js"

const ENGINE_KEY = "snapshot.json"

export class Engine {
  public static instance: Engine | null = null
  private orderbook: Orderbook | null
  private userPosition: Map<String, UserPosition> = new Map()

  private constructor() {
    this.orderbook = null
  }

  public static getInstance(): Engine {
    if(!this.instance) {
      this.instance = new Engine()
    }
    return this.instance
  }

  static async create() {
    if (Engine.instance) return Engine.instance

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
      console.log("Saving snapshot")
    }, 5000);
    return engine
  }

  private async saveSnapshot () {
    const snapshot = {
      orderbook: this.orderbook?.getSnapshot(),
      userPosition: Array.from(this.userPosition.entries())
    }
    await S3Manager.uploadSnapshot(snapshot, ENGINE_KEY)
  }

  processOrder(order: Order) {

  }
}