import { Queue } from "bullmq"

export const eventQueue = new Queue("EVENT_QUEUE", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379
  }
})

export const liquidationQueue = new Queue("LIQUIDATION_QUEUE", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379
  }
})

export const fundingQueue = new Queue("FUNDING_QUEUE", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379
  }
})

export async function scheduleFunding() {
  await fundingQueue.add(
    'run-funding',          
    {},                       
    {
      repeat: {
        pattern: '0 */8 * * *', 
        tz: 'Asia/Kolkata', 
      },
    },
  );
}
