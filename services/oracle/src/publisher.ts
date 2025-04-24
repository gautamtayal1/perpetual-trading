import onMarketDataUpdate from "./marketDataBus.js";
import { RedisManager } from "@repo/event-queue";

onMarketDataUpdate(({top, index}) => {
  try {
    const ask = parseInt(top.a[0])
    const bid = parseInt(top.b[0])

    const markPrice = medianOfThree(ask, bid, index)
    const fundingRate = computeFundingRate(index, markPrice)
    
    RedisManager.getInstance().publishToChannel('markPrice:update', markPrice)
    RedisManager.getInstance().publishToChannel('fundingRate:update', {
      fundingRate,
      markPrice
    })
  } catch (error) {
    console.error("Error processing market data update:", error);
  }
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