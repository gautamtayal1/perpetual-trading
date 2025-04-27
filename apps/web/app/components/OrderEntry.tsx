'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useWebSocket } from '../hooks/useWebSocket';

const OrderEntry: React.FC = () => {
  const {data: session} = useSession();
  const userId = session?.user?.id;

  const [orderType, setOrderType] = useState('LIMIT-CREATE');
  const [price, setPrice] = useState('95000');
  const [size, setSize] = useState('1');
  const [balance, setBalance] = useState(0);
  const { isConnected, subscribe, unsubscribe } = useWebSocket(`ws://64.227.155.9:8081`);
  
  const handlePlaceOrder = (orderSide: string) => {
    try {
      console.log(userId);
      const order = axios.post(`http://64.227.155.9:8080/order/create`, {
        userId: userId,
        market: "BTCUSDT",
        entryPrice: Number(price),
        quantity: Number(size),
        side: orderSide,
        type: orderType,
        leverage: "10"
      });
      console.log(order);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const response = await axios.get(`http://64.227.155.9:8080/balance/${userId}`);
      setBalance(response.data.user.balance);
    };
    fetchBalance();
  }, [userId]);

  useEffect(() => {
    console.log("isConnected", isConnected);
    if (isConnected) {
      subscribe(`balance@${userId}`, (data) => {
        setBalance(data.data.a);
      });
    }
  }, [isConnected, subscribe, unsubscribe, userId]);

  return (
    <div className="h-full overflow-y-auto p-2">
      {/* Order Type Tabs */}
      <h3 className='font-medium mb-3'>
        Place Order
      </h3>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#1E1E1E] rounded-full px-3 h-8 shadow-lg hover:shadow-[#1E1E1E]/50 transition-all duration-300">
            <span className="text-xs px-2 text-[#8A8A8A] font-medium">Balance:</span>
            <span className="text-xs px-2 text-[#0ECB81] font-bold animate-pulse">{balance}</span>
            <div className="ml-2 w-2 h-2 rounded-full bg-[#0ECB81] animate-ping"></div>
          </div>
        </div>
      </div>
      
      
      {/* Order Type Buttons */}
      <div className="flex border-b border-[#2A2A2A] mb-2">
        <button 
          className={`text-xs px-3 py-1 ${orderType === 'LIMIT-CREATE' ? 'border-b-2 border-[#F0B90B]' : 'text-[#8A8A8A]'}`}
          onClick={() => setOrderType('LIMIT-CREATE')}
        >
          Limit
        </button>
        <button 
          className={`text-xs px-3 py-1 ${orderType === 'MARKET-CREATE' ? 'border-b-2 border-[#F0B90B]' : 'text-[#8A8A8A]'}`}
          onClick={() => setOrderType('MARKET-CREATE')}
        >
          Market
        </button>
      </div>
      {/* Order Form */}
      <div className="space-y-2">
        {/* Price Input */}
        <div>
        {orderType === "LIMIT-CREATE" && <div className="relative">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#8A8A8A]">Price</span>
          
          </div>
          
            <input 
              type="text" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded p-1 text-sm"
            />
            <div className="absolute right-2 top-7/10 transform -translate-y-1/2 text-xs text-[#8A8A8A]">USDT</div>
          </div>}
        </div>
        
        {/* Size Input */}
        <div className="py-1">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#8A8A8A]">Size</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="0.000" 
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded p-2 text-sm h-8"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#8A8A8A]">BTC</div>
          </div>
          
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-5 mx-1">
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="bg-[#0ECB81] text-bal rounded-lg p-2 text-sm font-medium 
                       hover:scale-105 hover:shadow-lg hover:shadow-[#0ECB81]/20 
                       transition-all duration-300 ease-in-out 
                       active:scale-95 active:shadow-none
                       focus:outline-none focus:ring-2 focus:ring-[#0ECB81]/50"
              onClick={() => handlePlaceOrder('LONG')}
            >
              Buy / Long
            </button>
            <button 
              className="bg-[#F6465D] text-white rounded-lg p-2 text-sm font-medium 
                       hover:scale-105 hover:shadow-lg hover:shadow-[#F6465D]/20 
                       transition-all duration-300 ease-in-out 
                       active:scale-95 active:shadow-none
                       focus:outline-none focus:ring-2 focus:ring-[#F6465D]/50"
              onClick={() => handlePlaceOrder('SHORT')}
            >
              Sell / Short
            </button>
          </div>
          {/* <button 
            className="bg-[#F0B90B] text-black rounded-lg p-2 text-sm font-medium 
                     hover:scale-105 hover:shadow-lg hover:shadow-[#F0B90B]/20 
                     transition-all duration-300 ease-in-out 
                     active:scale-95 active:shadow-none
                     focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50"
            onClick={() => handlePlaceOrder('MOCK')}
          >
            Send Mock Orders
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default OrderEntry;
