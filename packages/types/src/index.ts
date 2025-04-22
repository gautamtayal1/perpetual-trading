export type OrderType = "MARKET-CREATE" | "LIMIT-CREATE" | "LIMIT-CANCEL";
export type OrderSide = "LONG" | "SHORT" | null;

export interface Order {
  userId: string;
  market: "BTCUSDT";
  entryPrice: number;
  quantity: number;
  type: OrderType;
  side: OrderSide;
  leverage: number;
};

export interface UserPosition {
  market: "BTCUSDT";
  side: OrderSide;
  quantity: number;
  entryPrice: number; 
  notionalValue?: number
  margin: number;
  unrealizedPnl?: number
  liquidatedPrice?: number
}

export interface UserBalance {
  availableBalance: number;
  lockedBalance: number;
}
