import { Queue } from "bullmq"

export const eventQueue = new Queue("EVENT_QUEUE", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379
  }
})
