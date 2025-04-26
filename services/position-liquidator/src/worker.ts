import axios from "axios";
import { Worker } from "bullmq";

const worker = new Worker("LIQUIDATION_QUEUE", async(job) => {
  const orderObj = job.data
  const leverage = orderObj.entryPrice * orderObj.quantity / orderObj.margin

  try {
    const order = await axios.post(`http://${process.env.NEXT_PUBLIC_SERVER_URL}/order/create`, {
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

export default worker