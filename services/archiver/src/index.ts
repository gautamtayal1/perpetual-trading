import { Worker } from "bullmq"
import prisma from "@repo/db/client";
import { Fill } from "@repo/types";

;(async () => {
  const worker = new Worker("EVENT_QUEUE", async(job) => {
    const { type, data } = job.data

    if (type === "ORDER_UPDATE") {
      await prisma.order.create({
        data: {
          id: data.id,
          entryPrice: data.entryPrice,
          quantity: data.quantity,
          leverage: data.leverage,
          userId: data.userId,
          executedQty: data.filled,
          side: data.side,
        }
      })
    }

    if (type === "DEPTH_UPDATE") {
      await prisma.depth.upsert({
        where: {
          id: data.id,
        },
        update: {
          bids: data.bids,
          asks: data.asks,
        },
        create: {
          bids: data.bids,
          asks: data.asks,
        }
      })
    }

    if (type === "BALANCE_UPDATE") {
      await prisma.user.update({
        where: {
          id: data.userId,
        },
        data: {
          balance: data.balance
        }
      })
    }

    if (type === "FILL_UPDATE") {
      data.forEach(async (fill: Fill) => {
        await prisma.trade.createMany({
          data: [{
            id: fill.fillId,
            price: fill.price,
            quantity: fill.quantity,
            side: fill.side!,
            orderId: fill.orderId,
            userId: fill.otherUserId
          }, {
            id: fill.fillId,
            price: fill.price,
            quantity: fill.quantity,
            side: fill.side!,
            orderId: fill.orderId,
            userId: fill.userId
          }]
        })
      })
    }
    if (type === "POSITION_UPDATE") {
      await prisma.position.create({
        data: {
          id: data.id,
          side: data.side,
          quantity: data.quantity,
          entryPrice: data.entryPrice,
          margin: data.margin,
          userId: data.userId,
        }
      })
    }
  }, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
      }
    }
  )

  worker.on("completed", (job) => {
    console.log("job archived successfully", job.data)
  })
  
  worker.on("failed", (job, err) => {
    console.log("job archive failed", job?.data, err.message)
  })
})()