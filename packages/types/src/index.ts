export type OrderType = "MARKET" | "LIMIT";
export type OrderSide = "LONG" | "SHORT";

export interface Order {
  userId: string;
  market: string;
  price: number;
  quantity: number;
  type: OrderType;
  side: OrderSide;
  leverage: number;
};

