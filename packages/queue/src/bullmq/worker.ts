import "dotenv/config";
import { Worker } from "bullmq";
import { Engine } from "@repo/engine"
console.log(process.env.AWS_REGION, process.env.S3_BUCKET_NAME, process.env.S3_ENDPOINT, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY)

;(async() => {
  const engine = await Engine.create()
  Engine.instance = engine
  
  const worker = new Worker("ORDER_QUEUE", async(job) => {
    const order = job.data
    console.log("worker processing data")
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