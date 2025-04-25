'use client'

import React from 'react';
import BinanceHeader from '../components/Header';
import MarketTabs from '../components/MarketTabs';
import ChartSection from '../components/ChartSection';
import OrderBook from '../components/OrderBook';
import PositionsTable from '../components/PositionTable';

const BtcusdtTradingPage: React.FC = () => {
  
  return (
    <div>
      <div className="h-screen flex flex-col overflow-hidden bg-[#0B0B0B] text-white">
        {/* Header */}
        <BinanceHeader />
        {/* <div>
          {"Mark Price: " + markPrice}
        </div> */}
        
        {/* Market Tabs */}
        <MarketTabs />
        
        {/* Trading Container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chart Section (60%) */}
          <ChartSection/>
          
          {/* Right Panel (40%) */}
          <div className="w-1/5 flex flex-col overflow-hidden">
            {/* Order Book & Trades Panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* OrderBook with OrderEntry integrated inside */}
              <div className="h-[100vh] overflow-hidden mb-1">
                <OrderBook />
              </div>
              
              {/* Recent Trades */}
            
            </div>
          </div>
        </div>
      </div>
      <PositionsTable/>
    </div>
  );
};

export default BtcusdtTradingPage;
