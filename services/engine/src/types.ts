export interface Order {
  id: string
  userId: string
  side: "buy" | "sell"
  type: "limit"
  price: number
  filledQty: number
  timestamp: number
}