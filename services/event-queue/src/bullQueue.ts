import { Queue } from "bullmq"

export const orderQueue = new Queue("ORDER_PROCESSOR", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379
  }
})
