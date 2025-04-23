'use client'

import React, { useState } from 'react';

const timeframes = ['15m', '1H', '4H', '1D', '1W'];
const viewTypes = ['Original', 'Trading View', 'Depth'];

const ChartSection: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('15m');
  const [activeView, setActiveView] = useState('Original');
  const [activeTab, setActiveTab] = useState('Chart');

  return (
    <div className="w-3/5 border-r border-[#2A2A2A] flex flex-col overflow-hidden">
      {/* Market Info */}
      <div className="flex items-center justify-between p-2 border-b border-[#2A2A2A]">
        <div className="flex items-center">
          <div className="mr-4">
            <div className="flex items-center">
              <span className="font-bold text-lg mr-2">BTCUSDT</span>
              <span className="text-xs text-gray-400">Perp</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="flex text-xs mt-1">
              <span className="text-[#0ECB81]">93215.8</span>
              <span className="text-[#0ECB81] ml-2">+14.84%</span>
            </div>
          </div>
          
          <div className="flex space-x-4 text-xs text-gray-400">
            <div>
              <div>Mark</div>
              <div className="text-white">93,217.7</div>
            </div>
            <div>
              <div>Index<sup>*</sup></div>
              <div className="text-white">92,640.5</div>
            </div>
            <div>
              <div>Funding / Countdown</div>
              <div className="text-white">0.01%/01:59:00</div>
            </div>
            <div>
              <div>24h High</div>
              <div className="text-white">94,092.2</div>
            </div>
            <div>
              <div>24h Low</div>
              <div className="text-white">84,914.4</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="bg-[#121212] p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Chart Tabs */}
      <div className="flex border-b border-[#2A2A2A] text-sm">
        <button 
          className={`py-2 px-4 ${activeTab === 'Chart' ? 'text-white border-b-2 border-[#F0B90B]' : 'text-gray-400'}`}
          onClick={() => setActiveTab('Chart')}
        >
          Chart
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'Info' ? 'text-white border-b-2 border-[#F0B90B]' : 'text-gray-400'}`}
          onClick={() => setActiveTab('Info')}
        >
          Info
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'TradingData' ? 'text-white border-b-2 border-[#F0B90B]' : 'text-gray-400'}`}
          onClick={() => setActiveTab('TradingData')}
        >
          Trading Data
        </button>
      </div>
      
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] p-2 text-xs">
        <div className="flex items-center space-x-1">
          {timeframes.map(tf => (
            <button
              key={tf}
              className={`px-2 py-1 ${activeTimeframe === tf ? 'border border-[#2A2A2A] rounded bg-[#121212]' : ''}`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
          <button className="flex items-center ml-2">
            <span>Last Price</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {viewTypes.map(view => (
            <button
              key={view}
              className={`px-2 py-1 ${activeView === view ? 'bg-[#121212] rounded border border-[#2A2A2A]' : ''}`}
              onClick={() => setActiveView(view)}
            >
              {view}
            </button>
          ))}
          <button className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Chart Content */}
      <div className="flex-1 relative overflow-hidden p-2">
        {/* Order Buttons Overlay */}
        <div className="absolute top-2 left-4 flex space-x-2 z-10">
          <button className="bg-[#0ECB81] text-white text-xs py-2 px-3 rounded">
            Buy/Long<br/>
            <span className="text-xxs">93215.8</span>
          </button>
          <button className="bg-[#1E1E1E] text-xs py-1 px-3 rounded flex items-center border border-[#2A2A2A]">
            Size (BTC)<br/>
            <span className="text-xxs">Enter Size</span>
          </button>
          <button className="bg-[#F6465D] text-white text-xs py-2 px-3 rounded">
            Sell/Short<br/>
            <span className="text-xxs">93215.8</span>
          </button>
          <button className="text-xs py-1 px-2 rounded bg-[#121212] border border-[#2A2A2A]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Chart */}
        <div className="w-full h-full flex flex-col">
          {/* Candlestick Chart Area - 80% height */}
          <div className="h-4/5 relative">
            <div className="absolute right-2 text-xs text-gray-400">
              <div>110000.0</div>
              <div className="mt-12">105000.0</div>
              <div className="mt-12">100000.0</div>
              <div className="mt-12">95000.0</div>
              <div className="mt-12">90000.0</div>
              <div className="mt-12">85000.0</div>
              <div className="mt-12">80000.0</div>
              <div className="mt-12">75000.0</div>
              <div className="mt-12">70000.0</div>
            </div>
            
            {/* Candlestick chart would be implemented with a proper charting library */}
            <div className="w-full h-full flex items-end pl-10">
              {/* This will be replaced by a real chart implementation */}
            </div>
          </div>
          
          {/* Volume Histogram - 20% height */}
          <div className="h-1/5 border-t border-[#2A2A2A] pt-2 flex items-end">
            {/* This will be replaced by a real volume histogram implementation */}
          </div>
          
          {/* Time axis */}
          <div className="text-xxs text-[#8A8A8A] pt-1 flex justify-between px-10">
            <span>02/01</span>
            <span>03/01</span>
            <span>04/01</span>
            <span>05/01</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Data */}
      <div className="flex items-center p-2 text-xs border-t border-[#2A2A2A]">
        <div className="flex items-center mr-4">
          <span className="text-[#8A8A8A] mr-2">VOL(BTC):</span>
          <span>103.92K</span>
        </div>
        <div className="flex items-center mr-4">
          <span className="text-[#8A8A8A] mr-2">VOL(USDT):</span>
          <span>9.4028</span>
        </div>
        <div className="flex items-center mr-4">
          <span className="text-[#0ECB81] mr-2">168.06K</span>
        </div>
        <div className="flex items-center">
          <span className="text-[#F6465D]">169.54K</span>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
