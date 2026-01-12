"use client";

import OrderEntry from "./OrderEntry";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useWebSocketContext } from "../context/WebSocketContext";

interface OrderData {
  price: string;
  size: string;
}

const OrderBook = () => {
  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const { isConnected, subscribe, unsubscribe } = useWebSocketContext();

  useEffect(() => {
    const fetchDepth = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/depth`);
        console.log(response.data);
        setAsks(response.data.asks);
        setBids(response.data.bids);
      } catch (error) {
        console.error("Error fetching depth:", error);
      }
    };
    fetchDepth();
  }, []);

  const handleDepthUpdate = useCallback((data: any) => {
    console.log("depth update", data);
    setAsks(data.data.a);
    setBids(data.data.b);
  }, []);

  useEffect(() => {
    console.log("isConnected", isConnected);
    if (isConnected) {
      subscribe("depth:update", handleDepthUpdate);
    }
    return () => {
      unsubscribe("depth:update");
    };
  }, [isConnected, subscribe, unsubscribe, handleDepthUpdate]);
  
  return (
    <div className="bg-[#1A1A1A] rounded-md flex flex-col h-full text-white">
      {/* OrderBook Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="p-3 border-b border-[#2A2A2A] flex justify-between shrink-0">
          <h3 className="font-medium">Order Book</h3>
        </div>

        {/* Side by side order books */}
        <div className="flex flex-1 min-h-0">
          {/* Sell Orders - Left Side */}
          <div className="w-1/2 border-r border-[#2A2A2A] flex flex-col min-h-0">
            {/* Sell Header */}
            <div className="px-3 py-1.5 grid grid-cols-2 text-xs text-white shrink-0">
              <div>Price (USDT)</div>
              <div className="text-right">Size (BTC)</div>
            </div>

            {/* Sell Orders List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {asks.map((order: any, index) => (
                <div
                  key={index}
                  className="px-3 py-1 grid grid-cols-2 text-xs hover:bg-[#212121] relative"
                >
                  <div className="text-red-500 z-10">{Number(order[0]).toFixed(1)}</div>
                  <div className="text-right z-10">{Number(order[1]).toFixed(2)}</div>
                  <div
                    className="absolute top-0 right-0 h-full bg-red-800/10"
                    style={{ width: `${Math.min(parseFloat(order[1]) * 30, 100)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* Buy Orders - Right Side */}
          <div className="w-1/2 flex flex-col min-h-0">
            {/* Buy Header */}
            <div className="px-3 py-1.5 grid grid-cols-2 text-xs text-white shrink-0">
              <div>Price (USDT)</div>
              <div className="text-right">Size (BTC)</div>
            </div>

            {/* Buy Orders List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {bids.map((order: any, index) => (
                <div
                  key={index}
                  className="px-3 py-1 grid grid-cols-2 text-xs hover:bg-[#212121] relative"
                >
                  <div className="text-green-500 z-10">{Number(order[0]).toFixed(1)}</div>
                  <div className="text-right z-10">{Number(order[1]).toFixed(2)}</div>
                  <div
                    className="absolute top-0 left-0 h-full bg-green-800/10"
                    style={{ width: `${Math.min(parseFloat(order[1]) * 30, 100)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#2A2A2A]">
        <OrderEntry />
      </div>
    </div>
  );
};

export default OrderBook;
