import axios from "axios";
import { Worker } from "bullmq";

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Missing REDIS_HOST or NEXT_PUBLIC_API_URL in env");
}

const worker = new Worker("LIQUIDATION_QUEUE", async(job) => {
  const orderObj = job.data
  const leverage = orderObj.entryPrice * orderObj.quantity / orderObj.margin

  try {
    const order = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/create`, {
      userId: orderObj.userId,
      entryPrice: orderObj.entryPrice,
      quantity: orderObj.quantity,
      side: orderObj.side,
      type: "MARKET-LIQUIDATE",
    leverage
  }, {
    withCredentials: true
  })
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
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

export default worker