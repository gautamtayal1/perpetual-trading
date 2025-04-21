import { createClient, RedisClientType } from "redis"

export class RedisManager {
  public static instance: RedisManager
  private client: RedisClientType

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL
    })
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager()
    }
    return this.instance
  }

  public publishToChannel (channel: string, message: any) {
    this.client.publish(channel, JSON.stringify(message))
  }
}