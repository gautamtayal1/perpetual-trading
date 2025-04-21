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

  subscribe(channel: string) {
    this.redisClient.subscribe(channel, message => {
      console.log(message)
    })
  }
}