import { createClient } from 'redis'
import WebSocket, { WebSocketServer } from 'ws'
import dotenv from "dotenv";

dotenv.config();

async function startWSS() {
  if (!process.env.REDIS_URL || !process.env.WSS_PORT || !process.env.NEXT_PUBLIC_WSS_URL) {
    throw new Error("Missing REDIS_URL or WSS_PORT or NEXT_PUBLIC_WSS_URL in env");
  }

  const REDIS_URL = process.env.REDIS_URL
  const WSS_PORT  = +(process.env.WSS_PORT)

  const wss = new WebSocketServer({ port: WSS_PORT })
  console.log(`WSS listening on ${process.env.NEXT_PUBLIC_WSS_URL}`)

  wss.on('connection', async ws => {
    console.log('Client connected')

    const redisSub = createClient({ url: REDIS_URL })
    redisSub.on('error', err => console.error('Redis Error', err))
    await redisSub.connect()

    ws.on("message", async raw => {
      let msg: any
      try {
        msg = JSON.parse(raw.toString())
      } catch {
        return
      }

      if (msg.method === 'subscribe_orderbook' && Array.isArray(msg.events)) {
        for (const channel of msg.events) {
          await redisSub.subscribe(channel, message => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                stream: channel,
                data: JSON.parse(message)
              }))
            }
          })
        }
      }

      if (msg.method === 'unsubscribe_orderbook' && Array.isArray(msg.events)) {
        for (const channel of msg.events) {
          await redisSub.unsubscribe(channel)
        }
      }
    })

    ws.on('close', async () => {
      console.log('Client disconnected')
      await redisSub.disconnect()
    })
  })
}

startWSS().catch(err => {
  console.error(err)
  process.exit(1)
})
