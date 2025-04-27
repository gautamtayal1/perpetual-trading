"use client";

import { MoreHorizontal } from "lucide-react";
import OrderEntry from "./OrderEntry";
import { useState, useEffect } from "react";
import axios from "axios";
import { useWebSocket } from "../hooks/useWebSocket";
interface OrderData {
  price: string;
  size: string;
}

const OrderBook = () => {
  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const { isConnected, subscribe, unsubscribe } = useWebSocket(`ws://64.227.155.9:8081`);

  useEffect(() => {
    const fetchDepth = async () => {
      try {
        const response = await axios.get(`http://64.227.155.9:8080/depth`);
        console.log(response.data);
        setAsks(response.data.asks);
        setBids(response.data.bids);
      } catch (error) {
        console.error("Error fetching depth:", error);
      }
    };
    fetchDepth();
  }, []);

  useEffect(() => {
    console.log("isConnected", isConnected);
    if (isConnected) {
      subscribe("depth:update", (data) => {
        console.log("depth update", data);
        setAsks(data.data.a);
        setBids(data.data.b);
      });
    }
  }, [isConnected, subscribe, unsubscribe]);
  
  return (
    <div className="bg-[#1A1A1A] rounded-md flex flex-col h-full text-white">
      {/* OrderBook Section - Top Half */}
      <div className="h-42/100">
        <div className="p-3 border-b border-[#2A2A2A] flex justify-between">
          <h3 className="font-medium">Order Book</h3>
          <button>
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        {/* Side by side order books */}
        <div className="flex h-[calc(100%-40px)]">
          {/* Sell Orders - Left Side */}
          <div className="w-1/2 border-r border-[#2A2A2A]">
            {/* Sell Header */}
            <div className="px-3 py-1 grid grid-cols-2 text-xs text-gray-400">
              <div>Price (USDT)</div>
              <div className="text-right">Size (BTC)</div>
            </div>
            
            {/* Sell Orders List */}
            <div className="overflow-y-auto" style={{ maxHeight: "160px" }}>
              {asks.map((order: any, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1 grid grid-cols-2 text-xs hover:bg-[#212121] relative"
                >
                  <div className="text-red-500 z-10">{order[0]}</div>
                  <div className="text-right z-10">{order[1]}</div>
                  <div 
                    className="absolute top-0 right-0 h-full bg-red-800/10" 
                    style={{ width: `${Math.min(parseFloat(order.size) * 30, 100)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Buy Orders - Right Side */}
          <div className="w-1/2">
            {/* Buy Header */}
            <div className="px-3 py-1 grid grid-cols-2 text-xs text-gray-400">
              <div>Price (USDT)</div>
              <div className="text-right">Size (BTC)</div>
            </div>
            
            {/* Buy Orders List */}
            <div className="overflow-y-auto" style={{ maxHeight: "160px" }}>
              {bids.map((order: any, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1 grid grid-cols-2 text-xs hover:bg-[#212121] relative"
                >
                  <div className="text-green-500 z-10">{order[0]}</div>
                  <div className="text-right z-10">{order[1]}</div>
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-800/10" 
                    style={{ width: `${Math.min(parseFloat(order.size) * 30, 100)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>  
      </div>
      
      {/* Order Entry Form - Bottom Half */}
      <div className="h-55/100 border-t border-[#2A2A2A]">
        <OrderEntry />
      </div>
    </div>
  );
};

export default OrderBook;
