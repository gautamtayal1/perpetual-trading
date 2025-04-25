// packages/wss/src/index.ts
import { createClient } from 'redis'
import { WebSocketServer } from 'ws'

async function startWSS() {
  const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
  const WSS_PORT  = +(process.env.WSS_PORT  || 8081)

  // 1) Create a WS server
  const wss = new WebSocketServer({ port: WSS_PORT })
  console.log(`WSS listening on ws://localhost:${WSS_PORT}`)

  wss.on('connection', async ws => {
    console.log('Client connected')

    // 2) For this client, spin up its own Redis subscriber
    const redisSub = createClient({ url: REDIS_URL })
    redisSub.on('error', err => console.error('Redis Error', err))
    await redisSub.connect()

    // 3) Listen for client messages to subscribe/unsubscribe
    ws.on('message', async raw => {
      let msg: any
      try {
        msg = JSON.parse(raw.toString())
      } catch {
        return
      }

      // e.g. { method: "subscribe_orderbook", events: ["prices:update","depth@BTCUSDT"] }
      if (msg.method === 'subscribe_orderbook' && Array.isArray(msg.events)) {
        for (const channel of msg.events) {
          await redisSub.subscribe(channel, message => {
            if (ws.readyState === WebSocket.OPEN) {
              // wrap it so client hook sees {stream, data}
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
