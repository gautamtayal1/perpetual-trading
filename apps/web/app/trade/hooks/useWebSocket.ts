import { useCallback, useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const messageHandlers = useRef<Map<string, (data: any) => void>>(new Map())

  useEffect(() => {
    if(!url) return

    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      console.log("websocket connected")
      setIsConnected(true)
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log(data)
        if (data.stream) {
          const handler = messageHandlers.current.get(data.stream)
          if(handler) {
            handler(data.data)
          }
        }
        setMessages((prev) => [...prev, data])
        
      } catch (error) {
        setMessages((prev) => [...prev, event.data])
        console.log(error)
      }
    }
    ws.current.onclose = () => {
      console.log("Websocket Disconnected")
      setIsConnected(false)
    }
    return () => {
      ws.current?.close()
    }
  }, [url])

  const subscribe = useCallback((channel: string, callback?: (data: any) => void) =>  {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        method: "subscribe_orderbook",
        events: [channel]
      }))
      if (callback) {
        messageHandlers.current.set(channel, callback)
      }
      return true
    }
    return false
  }, [])

  const unsubscribe = useCallback((channel: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        method: "unsubscribe_orderbook",
        events: [channel]
      }))
      messageHandlers.current.delete(channel)
      return true
    }
    return false
  }, [])

  return {
    isConnected, 
    messages, 
    subscribe,
    unsubscribe,
  }
}