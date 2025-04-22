export interface Order {
  id: string
  userId: string
  side: "buy" | "sell"
  type: "limit"
  price: number
  filledQty: number
  timestamp: number
}

export interface OrderbookType {
  
}

export interface UserPosition {

}

export interface Orderbook {

}