import { onMarketDataUpdate } from "./marketDataBus.js";
import { RedisManager } from "@repo/event-queue";
import { Worker } from "bullmq";
import { Engine } from "@repo/engine";
import { scheduleFunding } from "@repo/event-queue";

let latestIndex: number
let latestMark: number

onMarketDataUpdate(({top, index}) => {
  const ask = parseInt(top.a[0])
  const bid = parseInt(top.b[0])
  const markPrice = medianOfThree(ask, bid, index)
  latestIndex = index
  latestMark = markPrice

  console.log("markPrice: ", markPrice)
  RedisManager.getInstance().publishToChannel('markPrice:update', markPrice)
  }
)

scheduleFunding().catch(console.error)

new Worker("FUNDING_QUEUE", async (job) => {
  const engine = Engine.getInstance()
  const fundingRate = computeFundingRate(latestIndex, latestMark)

  engine.applyFunding(fundingRate, latestMark)
})

function medianOfThree(a: number, b: number, c: number): number {
  const mn = Math.min(a, b, c);
  const mx = Math.max(a, b, c);
  return a + b + c - mn - mx;
}

function computeFundingRate(index: number, mark: number) {
  const initialRate = (mark - index) / index
  const clampedRate = Math.max(Math.min(initialRate, 0.05), -0.05)
  const timeAdjustedFundingRate = clampedRate * (8 / 24)
  return timeAdjustedFundingRate
}