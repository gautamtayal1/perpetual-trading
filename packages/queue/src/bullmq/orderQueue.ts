import { Queue } from "bullmq";
import { Order } from "@repo/types"

export const orderQueue = new Queue("ORDER_QUEUE", {
  connection: {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379
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
