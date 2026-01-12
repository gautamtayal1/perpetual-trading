"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

type Handler = (data: any) => void;

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (stream: string, handler: Handler) => void;
  unsubscribe: (stream: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const handlers = useRef(new Map<string, Set<Handler>>());
  const subscribedStreams = useRef(new Set<string>());
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    const url = process.env.NEXT_PUBLIC_WSS_URL;
    if (!url || ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      // Resubscribe to all streams
      subscribedStreams.current.forEach((stream) => {
        ws.current?.send(JSON.stringify({ method: "subscribe_orderbook", events: [stream] }));
      });
    };

    ws.current.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.stream && handlers.current.has(msg.stream)) {
          handlers.current.get(msg.stream)?.forEach((handler) => handler(msg.data));
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      // Reconnect after 2 seconds
      reconnectTimeout.current = setTimeout(connect, 2000);
    };

    ws.current.onerror = () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  }, [connect]);

  const subscribe = useCallback((stream: string, handler: Handler) => {
    if (!handlers.current.has(stream)) {
      handlers.current.set(stream, new Set());
    }
    handlers.current.get(stream)?.add(handler);

    // Subscribe on server if not already subscribed
    if (!subscribedStreams.current.has(stream)) {
      subscribedStreams.current.add(stream);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ method: "subscribe_orderbook", events: [stream] }));
      }
    }
  }, []);

  const unsubscribe = useCallback((stream: string, handler?: Handler) => {
    if (handlers.current.has(stream)) {
      if (handler) {
        handlers.current.get(stream)?.delete(handler);
      } else {
        // Clear all handlers for this stream
        handlers.current.get(stream)?.clear();
      }
      // Only unsubscribe from server if no more handlers
      if (handlers.current.get(stream)?.size === 0) {
        handlers.current.delete(stream);
        subscribedStreams.current.delete(stream);
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ method: "unsubscribe_orderbook", events: [stream] }));
        }
      }
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within WebSocketProvider");
  }
  return context;
}
