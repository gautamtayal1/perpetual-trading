import { Queue } from "bullmq"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error("Missing REDIS_HOST or REDIS_PORT in env");
}

export const eventQueue = new Queue("EVENT_QUEUE", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
})

export const liquidationQueue = new Queue("LIQUIDATION_QUEUE", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
})

export const fundingQueue = new Queue("FUNDING_QUEUE", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
})

