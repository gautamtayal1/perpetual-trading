export type OrderType = "MARKET-CREATE" | "LIMIT-CREATE" | "LIMIT-CANCEL";
export type OrderSide = "LONG" | "SHORT" | null;

export interface Order {
  id?: string;
  userId: string;
  market?: "BTCUSDT";
  entryPrice: number;
  quantity: number;
  type?: OrderType;
  side: OrderSide;
  leverage: number;
  filled: number;
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

export interface Fill {
  fillId: string
  orderId: string;
  userId: string;
  otherUserId: string;
  price: number;
  quantity: number;
  side?: OrderSide;
}
