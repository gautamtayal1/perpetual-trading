import WebSocket from "ws"
import { RedisManager } from "@repo/queue"

const STREAM = "btcusdt@trade"

export function startOracle() {
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${STREAM}`)

  ws.on("open", () => console.log("Binance WS connected"))

  ws.on("message", raw => {
    const message = JSON.parse(raw.toString())
    const price = parseFloat(message.p)
    const timeStamp = message.T

    const payload = JSON.stringify({s: "btcusdt", p: price, t: timeStamp})
    console.log(payload)
    RedisManager.getInstance().publishToChannel("prices:update", payload)
  })

  ws.on("error", (error) => console.error("WS Error: ", error))

}