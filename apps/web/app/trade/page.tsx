import React from 'react';
import BinanceHeader from '../components/Header';
import MarketTabs from '../components/MarketTabs';
import ChartSection from '../components/ChartSection';
import OrderBook from '../components/OrderBook';
import RecentTrades from '../components/RecentTrades';
import OrderEntry from '../components/OrderEntry';

const BtcusdtTradingPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0B0B0B] text-white">
      {/* Header */}
      <BinanceHeader />
      
      {/* Market Tabs */}
      <MarketTabs />
      
      {/* Trading Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chart Section (60%) */}
        <ChartSection />
        
        {/* Right Panel (40%) */}
        <div className="w-2/5 flex flex-col overflow-hidden">
          {/* Order Book & Trades Panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <OrderBook />
            <RecentTrades />
          </div>
          
          {/* Order Entry Panel */}
          <OrderEntry />
        </div>
      </div>
    </div>
  );
};

export default BtcusdtTradingPage;
