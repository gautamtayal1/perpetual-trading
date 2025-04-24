import "dotenv/config";
import { Worker } from "bullmq";
import { Engine } from "@repo/engine"

;(async() => {
  const engine = await Engine.create()
  Engine.instance = engine
  
  const worker = new Worker("ORDER_QUEUE", async(job) => {
    const order = job.data
    engine.processOrder(order)
  }, {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379
    }
  })

  worker.on("completed", (job) => {
    console.log("job completed: ", job.id)
  })

  worker.on("failed", (job, err) => {
    console.log("job failed: ", job?.id, err)
  })
})()