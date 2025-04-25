"use client"

import React from 'react';

const PositionsTable: React.FC = () => {
  const tabOptions = [
    "Positions(0)", 
    "Open Orders(0)", 
    "Order History", 
    "Trade History", 
    "Transaction History", 
    "Position History", 
    "API Key", 
    "Strategy"
  ];
  
  const [activeTab, setActiveTab] = React.useState('Positions(0)');

  return (
    <div className="w-full border-t border-[#2A2A2A] flex flex-col overflow-hidden bg-black">
      {/* Tab Header */}
      <div className="flex items-center border-b border-[#2A2A2A] bg-[#121212]">
        <div className="flex overflow-x-auto">
          {tabOptions.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm whitespace-nowrap ${
                activeTab === tab ? 'text-white' : 'text-[#8A8A8A]'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button className="px-4 py-2 text-[#8A8A8A]">
            <span className="text-xs">›</span>
          </button>
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
      
      {/* Table Header */}
      <div className="grid grid-cols-9 text-xs text-[#8A8A8A] border-b border-[#2A2A2A] py-2 px-4 bg-[#121212]">
        <div>Symbol</div>
        <div>Size</div>
        <div>Entry Price</div>
        <div>Break Even Price</div>
        <div>Mark Price</div>
        <div>Liq.Price</div>
        <div>Margin Ratio</div>
        <div>Margin</div>
        <div>PNL(ROI %)</div>
      </div>
      
      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-sm text-[#8A8A8A]">
        <div className="mb-4 bg-[#1E1E1E] p-6 rounded-full">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>You have no position.</div>
      </div>
    </div>
  );
};

export default PositionsTable;