import { WebSocketServer } from "ws"
import { SubscriptionManager } from "@repo/event-queue"

const wss = new WebSocketServer({ port: 8081 })

wss.on("listening", () => {
  SubscriptionManager.getInstance().subscribe("prices:update", (data) => {
    console.log(data)
  })
  console.log("wss is running on port 8081")
})

