import React from 'react';

const marketData = [
  { symbol: 'BTCUSDT', change: '+6.84%', isPositive: true },
  { symbol: 'BCHUSDT', change: '+0.15%', isPositive: true },
  { symbol: 'ETHUSDT', change: '+4.89%', isPositive: true },
  { symbol: 'ETCUSDT', change: '-6.51%', isPositive: false },
  { symbol: 'LTCUSDT', change: '-8.67%', isPositive: false },
  { symbol: 'XRPUSDT', change: '+7.77%', isPositive: true },
  { symbol: 'EOSUSDT', change: '', isPositive: null }
];

const MarketTabs: React.FC = () => {
  return (
    <div className="market-tabs flex items-center border-b border-[#2A2A2A] p-2 overflow-x-auto">
      <div className="flex space-x-4 min-w-full">
        {marketData.map((market, index) => (
          <div 
            key={index} 
            className={`flex items-center space-x-1 text-xs ${
              market.isPositive === true ? 'text-[#0ECB81]' : 
              market.isPositive === false ? 'text-[#F6465D]' : 
              'text-white'
            }`}
          >
            <span>{market.symbol}</span>
            {market.change && <span>{market.change}</span>}
          </div>
        ))}
        <div className="flex items-center space-x-1 text-xs">
          <span>...</span>
        </div>
      </div>
    </div>
  );
};

export default MarketTabs;
