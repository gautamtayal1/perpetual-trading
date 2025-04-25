import { useCallback, useEffect, useRef, useState } from "react"

type Message = { stream?: string; data?: any }
type Handler = (data: any) => void

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const handlers = useRef(new Map<string, Handler>())
  const pendingSubs = useRef<string[]>([])

  // connect / reconnect
  useEffect(() => {
    if (!url) return
    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      setIsConnected(true)
      // flush any pending subscriptions
      pendingSubs.current.forEach(ch =>
        ws.current?.send(JSON.stringify({ method: "subscribe_orderbook", events: [ch] }))
      )
      pendingSubs.current = []
    }
    ws.current.onmessage = e => {
      let msg: Message
      try {
        msg = JSON.parse(e.data)
      } catch {
        return
      }
      setMessages(prev => [...prev, msg])
      if (msg.stream) {
        handlers.current.get(msg.stream)?.(msg.data)
      }
    }
    ws.current.onclose = () => setIsConnected(false)
    ws.current.onerror = () => ws.current?.close()

    return () => ws.current?.close()
  }, [url])

  const subscribe = useCallback((stream: string, cb?: Handler) => {
    if (cb) handlers.current.set(stream, cb)
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ method: "subscribe_orderbook", events: [stream] }))
    } else {
      // wait until open
      pendingSubs.current.push(stream)
    }
  }, [])

  const unsubscribe = useCallback((stream: string) => {
    handlers.current.delete(stream)
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ method: "unsubscribe_orderbook", events: [stream] }))
    }
  }, [])

  return { isConnected, messages, subscribe, unsubscribe }
}
