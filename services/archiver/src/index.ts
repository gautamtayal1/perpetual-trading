import { Worker } from "bullmq"
import prisma from "@repo/db/client";

;(async () => {
  const worker = new Worker("EVENT_QUEUE", async(job) => {
    const { type, data } = job.data

    if (type === "ORDER_UPDATE") {
      await prisma.order.create({
        data: {
          id: data.id,
          entryPrice: data.entryPrice,
          quantity: data.quantity,
          leverage: parseInt(data.leverage),
          userId: data.userId,
          executedQty: data.filled,
          side: data.side,
        }
      })
    }

    if (type === "DEPTH_UPDATE") {
      await prisma.depth.upsert({
        where: {
          id: "BTCUSDT",
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
      await prisma.trade.createMany({
        data: [{
          id: data.fillId,
          price: data.price,
          quantity: data.quantity,
          side: data.side!,
          orderId: data.orderId,
          userId: data.otherUserId
          }, {
          id: data.fillId,
          price: data.price,
          quantity: data.quantity,
          side: data.side!,
          orderId: data.orderId,
          userId: data.userId
        }]
      })
    }
    if (type === "POSITION_UPDATE") {
      await prisma.position.upsert({
        where: {
          userId: data.userId,
        },
        update: {
          side: data.side,
          quantity: data.quantity,
          entryPrice: data.entryPrice,
          margin: data.margin,
        },
        create: {
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
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT!) || 6379,
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