'use client'

import React, { useState } from 'react';

const OrderEntry: React.FC = () => {
  const [leverageMode, setLeverageMode] = useState('Cross');
  const [orderType, setOrderType] = useState('Limit');
  const [price, setPrice] = useState('91461.1');
  const [size, setSize] = useState('');

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
          className={`text-xs px-3 py-1 ${orderType === 'Limit' ? 'border-b-2 border-[#F0B90B]' : 'text-[#8A8A8A]'}`}
          onClick={() => setOrderType('Limit')}
        >
          Limit
        </button>
        <button 
          className={`text-xs px-3 py-1 ${orderType === 'Market' ? 'border-b-2 border-[#F0B90B]' : 'text-[#8A8A8A]'}`}
          onClick={() => setOrderType('Market')}
        >
          Market
        </button>
        <button 
          className={`text-xs px-3 py-1 ${orderType === 'StopLimit' ? 'border-b-2 border-[#F0B90B]' : 'text-[#8A8A8A]'}`}
          onClick={() => setOrderType('StopLimit')}
        >
          Stop Limit
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
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#8A8A8A]">Size</span>
          </div>
          <div className="relative mb-1">
            <input 
              type="text" 
              placeholder="0.000" 
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded p-1 text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#8A8A8A]">BTC</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-5 mx-1">
          <button className="bg-[#0ECB81] text-white rounded p-2 text-sm font-medium">Buy/Long</button>
          <button className="bg-[#F6465D] text-white rounded p-2 text-sm font-medium">Sell/Short</button>
        </div>
        
        {/* Trade Info Footer */}
        <div className="flex justify-between text-xs text-[#8A8A8A] mt-1">
          <div>
            <span>Liq Price — USDT</span>
          </div>
          <div>
            <span>Cost 0.00 USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEntry;
