'use client'

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const OrderEntry: React.FC = () => {
  const {data: session} = useSession();

  const [leverageMode, setLeverageMode] = useState('Cross');
  const [orderType, setOrderType] = useState('');
  const [price, setPrice] = useState('94324.4');
  const [size, setSize] = useState('0.5');

  
  const handlePlaceOrder = (orderSide: string) => {
    try {
      console.log(session?.user?.id);
      const order = axios.post('http://localhost:8080/order/create', {
        userId: session?.user?.id,
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

  return (
    <div className="h-full overflow-y-auto p-2">
      {/* Order Type Tabs */}
      <h3 className='font-medium mb-3'>
        Place Order
      </h3>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#1E1E1E] rounded-full px-2 h-6">
            <button 
              className={`text-xs px-2 ${leverageMode === '10x' ? 'bg-[#121212]' : ''}`}
              onClick={() => setLeverageMode('10x')}
            >
              10x Leverage
            </button>
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
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#8A8A8A]">Price</span>
          
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded p-1 text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#8A8A8A]">USDT</div>
          </div>
        </div>
        
        {/* Size Input */}
        <div className="py-1">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#8A8A8A]">Size</span>
          </div>
          <div className="relative mb-2">
            <input 
              type="text" 
              placeholder="0.000" 
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded p-2 text-sm h-10"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#8A8A8A]">BTC</div>
          </div>
          <div className="flex justify-between text-xs text-[#8A8A8A]">
            <span>Min: 0.001 BTC</span>
            <span>Max: 1000 BTC</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-5 mx-1">
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
      </div>
    </div>
  );
};

export default OrderEntry;
