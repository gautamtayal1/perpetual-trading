'use client'

import React from 'react';

interface Trade {
  price: string;
  amount: string;
  time: string;
  isBuy: boolean;
}

// Sample data structure for recent trades
const recentTrades: Trade[] = [
  { price: '93,215.8', amount: '0.642', time: '03:30:59', isBuy: false },
  { price: '93,215.8', amount: '0.135', time: '03:30:58', isBuy: true },
  { price: '93,216.7', amount: '0.423', time: '03:30:57', isBuy: false },
  { price: '93,217.7', amount: '0.010', time: '03:30:56', isBuy: false },
  { price: '93,217.0', amount: '0.138', time: '03:30:54', isBuy: true },
  { price: '93,215.8', amount: '0.764', time: '03:30:53', isBuy: false }
];

const RecentTrades: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Trades');

  return (
    <div className="overflow-hidden flex flex-col">
      {/* Trades Header */}
      <div className="flex justify-between items-center p-2 border-t border-b border-[#2A2A2A] mt-2">
        <div className="flex space-x-4">
          <button 
            className={`text-sm ${activeTab === 'Trades' ? 'font-medium' : 'text-[#8A8A8A]'}`}
            onClick={() => setActiveTab('Trades')}
          >
            Trades
          </button>
          <button 
            className={`text-sm ${activeTab === 'TopMovers' ? 'font-medium' : 'text-[#8A8A8A]'}`}
            onClick={() => setActiveTab('TopMovers')}
          >
            Top Movers
          </button>
        </div>
        <button className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
      
      {/* Trades Table Header */}
      <div className="grid grid-cols-3 text-xxs text-[#8A8A8A] p-2 border-b border-[#2A2A2A]">
        <div className="text-left">Price (USDT)</div>
        <div className="text-right">Amount (BTC)</div>
        <div className="text-right">Time</div>
      </div>
      
      {/* Trades Table Content */}
      <div className="overflow-y-auto flex-1">
        {recentTrades.map((trade, index) => (
          <div key={index} className="grid grid-cols-3 text-xxs p-1">
            <div className={trade.isBuy ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>{trade.price}</div>
            <div className="text-right">{trade.amount}</div>
            <div className="text-right">{trade.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrades;
