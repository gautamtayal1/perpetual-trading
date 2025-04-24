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

  subscribe(channel: string, handler: (msg: any) => void) {
    this.redisClient.subscribe(channel, (message) => {
      if (message === "1" || message === "0") return;
      
      try {
        // Try parsing as JSON first
        const payload = JSON.parse(message);
        
        // Check if it has a data property and handle accordingly
        if (payload.data !== undefined) {
          handler(payload.data);
        } else {
          handler(payload);
        }
      } catch (error) {
        try {
          handler(message);
        } catch (innerError) {
          console.log(message);
          console.error("bad message on: ", channel);
        }
      }
    })
  }
}