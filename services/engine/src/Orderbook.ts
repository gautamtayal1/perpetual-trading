import { Order } from "./types.js"

export class Orderbook {
  bids: Order[]
  asks: Order[]
  market: string

  constructor(
    bids: Order[],
    asks: Order[],
    market: "BTCUSDT"
  ) {
    this.bids = bids
    this.asks = asks
    this.market = market
  }

  getSnapshot () {
    return {
      bids: this.bids,
      asks: this.asks,
      market: this.market,
    };
  }
}