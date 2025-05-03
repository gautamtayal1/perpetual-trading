import "dotenv/config";
import { Worker } from "bullmq";
import { Engine } from "@repo/engine"
import dotenv from "dotenv"

dotenv.config()

;(async() => {
  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    throw new Error("Missing REDIS_HOST or REDIS_PORT in env");
  }
  
  const engine = await Engine.create()
    console.log("engine: ", engine)
  const worker = new Worker("ORDER_QUEUE", async(job) => {
    const order = job.data
    engine.processOrder(order)
  }, {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT)
    }
  })

  worker.on("completed", (job) => {
    console.log("job completed: ", job.id)
  })

  worker.on("failed", (job, err) => {
    console.log("job failed: ", job?.id, err)
  })
})()