"use client"

import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface Position {
  quantity: number;
  side: string;
  entryPrice: number;
  markPrice: number;
  margin: number;
}

const PositionsTable: React.FC = () => {
  const tabOptions = ["Positions", "Orders"];
  const [activeTab, setActiveTab] = React.useState('Positions');
  const {data: session} = useSession();
  const userId = session?.user?.id;
  const [position, setPosition] = React.useState<Position | null>(null);
  const [orders, setOrders] = React.useState([]);
  const { isConnected, subscribe, unsubscribe } = useWebSocket("ws://localhost:8081");
  const [markPrice, setMarkPrice] = useState(0);
  
  useEffect(() => {
    console.log(userId);
    const fetchPosition = async () => {
      const response = await axios.get(`http://localhost:8080/position/${userId}`);
      console.log(response.data);
      setPosition(response.data);
    };
    fetchPosition();
  }, [userId]);

  useEffect(() => {
    console.log(userId);
    const fetchOrders = async () => {
      const response = await axios.get(`http://localhost:8080/order/${userId}`);
      console.log(response.data);
      setOrders(response.data);
    };
    fetchOrders();
  }, [userId]);

  useEffect(() => {
    console.log("isConnected", isConnected);
    if (isConnected) {
      subscribe("fundingRate:update", (data) => {
        setMarkPrice(data.markPrice.toFixed(1));
      });
    }
  }, [isConnected, subscribe, unsubscribe]);
  
  const handleCancelOrder = async (id: string, entryPrice: number, quantity: number, side: string) => {
    const response = await axios.post(`http://localhost:8080/order/create`, {
      id: id,
      userId: userId,
      market: "BTCUSDT",
      entryPrice: entryPrice,
      quantity: quantity,
      side: side,
      type: "LIMIT-CANCEL",
      leverage: "10"
    });
    console.log(response.data);
    setOrders(orders.filter((order: any) => order.id !== id));
  }
  return (
    <div className="w-full border-t border-[#2A2A2A] flex flex-col overflow-hidden bg-black pb-50">
      {/* Tab Header */}
      <div className="flex items-center border-b border-[#2A2A2A] bg-[#121212]">
        <div className="flex overflow-x-auto">
          {tabOptions.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm whitespace-nowrap ${
                activeTab === tab ? 'text-white border-b-2 border-[#0ECB81]' : 'text-[#8A8A8A]'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="ml-auto flex items-center mr-4">
          <div className="flex items-center mx-2">
            <input type="checkbox" className="mr-2 h-3 w-3" />
            <span className="text-xs text-[#8A8A8A]">Hide Other Symbols</span>
          </div>
          <button className="text-[#8A8A8A]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>

      {activeTab === 'Positions' ? (
        <>
          {/* Positions Table Header */}
          <div className="grid grid-cols-9 text-xs text-[#8A8A8A] border-b border-[#2A2A2A] py-2 px-4 bg-[#121212]">
            <div>Symbol</div>
            <div>Size</div>
            <div>Side</div>
            <div>Entry Price</div>
            <div>Mark Price</div>
            <div>Margin Ratio</div>
            <div>Margin</div>
            <div>PNL(ROI %)</div>
          </div>
        
          <div className="flex-1 flex flex-col overflow-y-auto">
            {position ? (
              <div className="grid grid-cols-9 text-sm py-2 px-4 hover:bg-[#1E1E1E] border-b border-[#2A2A2A]">
                <div className="text-white">BTCUSDT</div>
                <div className="text-[#0ECB81]">{position.quantity}</div>
                <div className="text-white">{position.side}</div>
                <div className="text-white">{position.entryPrice}</div>
                <div className="text-white">{markPrice}</div>
                <div className="text-white">0.5%</div>
                <div className="text-white">{position.margin}</div>
                <div className={`${(position.side === "LONG" ? (markPrice - position.entryPrice) * position.quantity : (position.entryPrice - markPrice) * position.quantity) < 0 ? 'text-[#F6465D]' : 'text-[#0ECB81]'}`}>
                  {position.side === "LONG" ? (markPrice - position.entryPrice) * position.quantity : (position.entryPrice - markPrice) * position.quantity} USDT 
                </div>
                <button className="bg-[#F6465D] text-white rounded py-1 text-xs font-medium hover:scale-105 hover:shadow-lg hover:shadow-[#F6465D]/20 transition-all duration-300 ease-in-out active:scale-95 active:shadow-none focus:outline-none focus:ring-2 focus:ring-[#F6465D]/50">
                  Close Position
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-sm text-[#8A8A8A]">
                <div className="mb-4 bg-[#1E1E1E] p-6 rounded-full">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>You have no position.</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Orders Table Header */}
          <div className="grid grid-cols-6 text-xs text-[#8A8A8A] border-b border-[#2A2A2A] py-2 px-4 bg-[#121212]">
            <div>Symbol</div>
            <div>Side</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Status</div>
          </div>
        
          <div className="flex-1 flex flex-col overflow-y-auto">
            {orders.map((order: any) => (
              <div className="grid grid-cols-6 text-sm py-2 px-4 hover:bg-[#1E1E1E] border-b border-[#2A2A2A]" key={order.id}>
                <div className="text-white">BTCUSDT</div>
                <div className="text-[#0ECB81]">{order.side}</div>
                <div className="text-white">{order.entryPrice}</div>
                <div className="text-white">{order.quantity}</div>
                <div className="text-white">{order.status}</div>
              <button className="bg-[#F6465D] text-white rounded py-1 px-1 text-xs font-medium hover:scale-105 hover:shadow-lg hover:shadow-[#F6465D]/20 transition-all duration-300 ease-in-out active:scale-95 active:shadow-none focus:outline-none focus:ring-2 focus:ring-[#F6465D]/50 w-40"
              onClick={() => {handleCancelOrder(order.id, order.entryPrice, order.quantity, order.side)}}>
                Cancel
              </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PositionsTable;