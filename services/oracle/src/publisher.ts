import { onMarketDataUpdate } from "./marketDataBus.js";
import { RedisManager } from "@repo/event-queue";

function medianOfThree(a: number, b: number, c: number): number {
  const mn = Math.min(a, b, c);
  const mx = Math.max(a, b, c);
  return a + b + c - mn - mx;
}

onMarketDataUpdate(({top, index}) => {
  const ask = parseInt(top.a[0])
  const bid = parseInt(top.b[0])
  const markPrice = medianOfThree(ask, bid, index)

  RedisManager.getInstance().publishToChannel('markPrice:update', markPrice)
}
)