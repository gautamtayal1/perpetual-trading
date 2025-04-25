import { createClient, RedisClientType } from "redis"

export class RedisManager {
  public static instance: RedisManager
  private client: RedisClientType

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL
    })
    this.client.connect().catch((err) => {
      console.error("Redis connection failed: ", err)
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

  public updateHash(channel: string, data: Record<string, string>) {
    this.client.hSet(channel, data)
  }
}