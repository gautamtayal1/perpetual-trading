import { Queue } from "bullmq";
import { Order } from "@repo/types"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error("Missing REDIS_HOST or REDIS_PORT in env");
}

export const orderQueue = new Queue("ORDER_QUEUE", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
})

export const addToQueue = async(order: Order) => {
  try {
    await orderQueue.add("order", order)
    console.log("order pushed to queue")
  } catch (error) {
    console.error("Error adding order to queue:", error)
  }
}
