import { SubscriptionManager } from "@repo/event-queue";
import { liquidationQueue } from "@repo/event-queue";

export class Liquidator {
  private latestMarkPrice: number | null = null
  private userPositions = new Map<string, {}>()
  private MAINTAINANCE_MARGIN = 0.05

  constructor () {
    const sub = SubscriptionManager.getInstance()

    sub.subscribe(
      "markPrice:update", 
      ({markPrice}) => {
        this.latestMarkPrice = markPrice
        this.checkAllPositions()
      }
    )

    sub.subscribe(
      'position:update',
      arr => {
        console.log("position:update", arr)
        this.userPositions.clear();
        for (const position of arr) {
          this.userPositions.set(position.userId, position.position);
        }
        this.checkAllPositions();
      }
    );
  }

  checkAllPositions () {
    if (!this.latestMarkPrice) return
    for (const [userId, position] of this.userPositions.entries()) {
      const liquidationQty = this.computeLiquidationQty(position, this.latestMarkPrice)
      if(liquidationQty && liquidationQty > 0) {
        this.enqueueLiquidation(userId, position, liquidationQty)
      }
    }
  }

  private computeLiquidationQty(position: any, markPrice: any) {
    const notional = position.entryPrice * Math.abs(position.quantity)
    const pnl = (markPrice - position.entryPrice) * position.quantity
    const equity = position.margin + pnl
    const req = this.MAINTAINANCE_MARGIN * notional
    const shortfall = req - equity
    if (!shortfall) {
      return null
    }
    if (shortfall === req) {
      const liquidationQty = position.quantity
      return liquidationQty
    }
    if (shortfall < req) {
      const liquidationQty = position.quantity * equity / req
      return liquidationQty
    }
    return null
  }

  private enqueueLiquidation(userId: string, position: any, liquidationQty: number) {
    liquidationQueue.add("liquidate_order", {
      data: {
        ...position,
        userId,
        liquidationQty
      }
    })
  }
}
