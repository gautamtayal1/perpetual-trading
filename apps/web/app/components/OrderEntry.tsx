'use client'

import React, { useState } from 'react';

const OrderEntry: React.FC = () => {
  const [leverageMode, setLeverageMode] = useState('Cross');
  const [orderType, setOrderType] = useState('Limit');
  const [tpslChecked, setTpslChecked] = useState(false);
  const [reduceOnlyChecked, setReduceOnlyChecked] = useState(false);
  const [price, setPrice] = useState('91461.1');
  const [size, setSize] = useState('');

  return (
    <div className="h-1/2 border-t border-[#2A2A2A] overflow-y-auto p-2">
      {/* Order Type Tabs */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#1E1E1E] rounded-full px-2 h-6">
            <button 
              className={`text-xs rounded-full px-2 ${leverageMode === 'Cross' ? 'bg-[#121212]' : ''}`}
              onClick={() => setLeverageMode('Cross')}
            >
              Cross
            </button>
            <button 
              className={`text-xs px-2 ${leverageMode === '10x' ? 'bg-[#121212]' : ''}`}
              onClick={() => setLeverageMode('10x')}
            >
              10x
            </button>
          </div>
          <button className="text-xs rounded-full px-2 py-1 border border-[#2A2A2A]">S</button>
        </div>
        <button className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
      
      {/* Order Type Buttons */}
      <div className="flex border-b border-[#2A2A2A] mb-3">
        <button 
          className={`text-xs px-4 py-2 ${orderType === 'Limit' ? 'border-b-2 border-[#F0B90B]' : 'text-[#8A8A8A]'}`}
          onClick={() => setOrderType('Limit')}
        >
          Limit
        </button>
        <button 
          className={`text-xs px-4 py-2 ${orderType === 'Market' ? 'border-b-2 border-[#F0B90B]' : 'text-[#8A8A8A]'}`}
          onClick={() => setOrderType('Market')}
        >
          Market
        </button>
        <button 
          className={`text-xs px-4 py-2 ${orderType === 'StopLimit' ? 'border-b-2 border-[#F0B90B]' : 'text-[#8A8A8A]'}`}
          onClick={() => setOrderType('StopLimit')}
        >
          Stop Limit
        </button>
        <button className="text-xxs px-2 py-1 ml-auto mr-2 my-1 bg-[#121212] rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      {/* Order Form */}
      <div className="space-y-3">
        {/* Price Input */}
        <div>
          <div className="flex justify-between text-xxs mb-1">
            <span className="text-[#8A8A8A]">Price</span>
            <span>
              <span className="border-b border-dotted border-[#8A8A8A] mr-1">Auto: 14604.21 USDT</span>
            </span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded p-2 text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#8A8A8A]">USDT</div>
            <button className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xs px-2 py-0.5 rounded bg-[#121212] border border-[#2A2A2A]">BBO</button>
          </div>
        </div>
        
        {/* Size Input */}
        <div>
          <div className="flex justify-between text-xxs mb-1">
            <span className="text-[#8A8A8A]">Size</span>
          </div>
          <div className="relative mb-1">
            <input 
              type="text" 
              placeholder="0.000" 
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded p-2 text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
              <span className="text-xs text-[#8A8A8A] mr-1">BTC</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Size Slider */}
          <div className="w-full bg-[#1E1E1E] h-1 rounded mb-2 relative">
            <div className="absolute inset-0 flex items-center justify-between px-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-[#8A8A8A] rounded-full"></div>
              <div className="w-1 h-1 bg-[#8A8A8A] rounded-full"></div>
              <div className="w-1 h-1 bg-[#8A8A8A] rounded-full"></div>
              <div className="w-1 h-1 bg-[#8A8A8A] rounded-full"></div>
            </div>
          </div>
          
          {/* Buy/Sell Size Display */}
          <div className="flex justify-center text-xxs text-[#8A8A8A]">
            <span>Buy 0.000 BTC | Sell 0.000 BTC</span>
          </div>
        </div>
        
        {/* Additional Options */}
        <div className="flex space-x-4 text-xs">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={tpslChecked}
              onChange={() => setTpslChecked(!tpslChecked)}
              className="mr-1 h-3 w-3 rounded"
            />
            <span>TP/SL</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={reduceOnlyChecked}
              onChange={() => setReduceOnlyChecked(!reduceOnlyChecked)}
              className="mr-1 h-3 w-3 rounded"
            />
            <span>Reduce-Only</span>
          </label>
          <div className="flex items-center ml-auto">
            <span className="text-xs mr-1">TIF</span>
            <span className="flex items-center border border-[#2A2A2A] px-2 py-0.5 rounded text-xs">
              GTC
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button className="bg-[#0ECB81] text-white rounded p-2 text-sm font-medium">Buy/Long</button>
          <button className="bg-[#F6465D] text-white rounded p-2 text-sm font-medium">Sell/Short</button>
        </div>
        
        {/* Trade Info Footer */}
        <div className="flex justify-between text-xxs text-[#8A8A8A] mt-2">
          <div>
            <span>Liq Price — USDT</span>
          </div>
          <div>
            <span>Cost 0.00 USDT</span>
          </div>
          <div>
            <span>Max 1.885 BTC</span>
          </div>
        </div>
        
        {/* Trading Quiz Prompt */}
        <div className="flex justify-center items-center p-2 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Finish Quiz to Get Started</span>
        </div>
      </div>
    </div>
  );
};

export default OrderEntry;
