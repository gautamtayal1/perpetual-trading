import {  fundingQueue, SubscriptionManager } from "@repo/event-queue"
import cron from "node-cron"

let latestFundingRate: number | null = null
let latestMarkPrice: number | null = null

SubscriptionManager.getInstance().subscribe(
  "fundingRate:update",
  ({ fundingRate, markPrice }) => {
    console.log("fundingRate: ", fundingRate)
    latestFundingRate = fundingRate
    latestMarkPrice = markPrice
  }
)

cron.schedule('0 0,8,16 * * *', () => {
  console.log("cron job running")
  console.log("latestFundingRate: ", latestFundingRate)
  console.log("latestMarkPrice: ", latestMarkPrice)
  fundingQueue.add("fundingRate", {
      fundingRate: latestFundingRate,
      markPrice: latestMarkPrice
  }),
  null,
  true,
  "Asia/Kolkata"
})

