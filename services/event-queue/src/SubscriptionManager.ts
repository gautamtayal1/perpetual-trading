import { createClient, RedisClientType } from "redis";

export class SubscriptionManager {
  private static instance: SubscriptionManager
  private redisClient: RedisClientType

  private constructor() {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    })
    this.redisClient.connect()
  }

  public static getInstance() {
    if(!this.instance) {
      this.instance = new SubscriptionManager()
    }
    return this.instance
  }

  subscribe<T = any>(channel: string, handler: (msg: T) => void) {
    this.redisClient.subscribe(channel, raw => {
      let payload
      try {
        payload = JSON.parse(raw)
        handler(payload)
      } catch (error) {
        console.error("bad message on: ", channel)
        return
      }
    })
  }
}