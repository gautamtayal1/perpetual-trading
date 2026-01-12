'use client'

import React, { useEffect, useState, useCallback } from 'react';
import LightweightCandlestickChart from './TradingViewChart';
import { useWebSocketContext } from '../context/WebSocketContext';
const timeframes = ['15m', '1H', '4H', '1D', '1W'];
const viewTypes = ['Original', 'Trading View', 'Depth'];
import { useNextCutoffCountdown } from '../hooks/useNextCutOffCountdown';

const ChartSection: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('15m');
  const [activeView, setActiveView] = useState('Original');
  const { isConnected, subscribe, unsubscribe } = useWebSocketContext();
  const [markPrice, setMarkPrice] = useState(0);
  const [indexPrice, setIndexPrice] = useState(0);
  const [fundingRate, setFundingRate] = useState(0);
  const { hours, minutes, seconds } = useNextCutoffCountdown()
  const pad = (n: number) => n.toString().padStart(2, '0')

  const handlePricesUpdate = useCallback((data: any) => {
    console.log("data", data);
    const parsedData = JSON.parse(data.data);
    const markPrice = parsedData.m.toFixed(1);
    const indexPrice = parsedData.i.toFixed(1);
    const fundingRate = (parsedData.r * 100).toFixed(4);
    setMarkPrice(Number(markPrice));
    setIndexPrice(Number(indexPrice));
    setFundingRate(Number(fundingRate));
  }, []);

  useEffect(() => {
    console.log("isConnected1", isConnected);
    if (isConnected) {
      subscribe("prices:update", handlePricesUpdate);
    }
    return () => {
      unsubscribe("prices:update");
    };
  }, [isConnected, subscribe, unsubscribe, handlePricesUpdate]);

  return (
    <div className="w-4/5 border-r border-[#2A2A2A] flex flex-col overflow-hidden">
      {/* Market Info */}
      <div className="flex items-center justify-between p-2 border-b border-[#2A2A2A]">
        <div className="flex items-center">
          <div className="mr-4">
            <div className="flex items-center">
              <span className="font-bold text-lg mr-2">BTCUSDT</span>
              <span className="text-xs text-gray-400">Perp</span>
             
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="flex text-xs mt-1">
              <span className="text-[#0ECB81]">${markPrice}</span>
            </div>
          </div>
          <div className="flex space-x-6 text-xs text-gray-400">
            <div className="flex flex-col items-center p-2 bg-[#121212] rounded-lg min-w-[100px]">
              <div className="text-[#8A8A8A] mb-1">Mark</div>
              <div className="text-[#0ECB81] font-medium text-sm">${markPrice}</div>
            </div>
            <div className="flex flex-col items-center p-2 bg-[#121212] rounded-lg min-w-[100px]">
              <div className="text-[#8A8A8A] mb-1">Index<sup>*</sup></div>
              <div className="text-[#0ECB81] font-medium text-sm">${indexPrice}</div>
            </div>
            <div className="flex flex-col items-center p-2 bg-[#121212] rounded-lg min-w-[100px]">
              <div className="text-[#8A8A8A] mb-1">Funding Rate</div>
              <div className={`font-medium text-sm ${fundingRate < 0 ? 'text-[#F6465D]' : 'text-[#0ECB81]'}`}>{fundingRate}%</div>
            </div>
            <div className="flex flex-col items-center p-2 bg-[#121212] rounded-lg min-w-[100px]">
              <div className="text-[#8A8A8A] mb-1">Countdown</div>
              <div className="text-[#0ECB81] font-medium text-sm">{pad(hours)}:{pad(minutes)}:{pad(seconds)}</div>
            </div>
            <div className="flex flex-col items-center p-2 bg-[#121212] rounded-lg min-w-[100px]">
              <div className="text-[#8A8A8A] mb-1">24h High</div>
              <div className="text-[#0ECB81] font-medium text-sm">$94,092.2</div>
            </div>
            <div className="flex flex-col items-center p-2 bg-[#121212] rounded-lg min-w-[100px]">
              <div className="text-[#8A8A8A] mb-1">24h Low</div>
              <div className="text-[#F6465D] font-medium text-sm">$84,914.4</div>
            </div>
            
           
          </div>
        </div>
      </div>
      
      {/* Chart Tabs */}
      <div className="flex border-b border-[#2A2A2A] text-sm">
        <button 
          className={`py-2 px-4 text-white border-b-2 border-[#F0B90B]`}
        >
          Chart
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
      <div className="flex-1 relative overflow-hidden p-2" style={{ height: '500px' }}>
        
        {/* Chart */}
        <LightweightCandlestickChart width="100%" height="100%" />
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
