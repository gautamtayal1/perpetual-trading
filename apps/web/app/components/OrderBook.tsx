import React from 'react';

interface OrderBookEntry {
  price: string;
  size: string;
  sum: string;
  depthPercent: number;
}

// Sample data structure for the order book UI
const askOrders: OrderBookEntry[] = [
  { price: '93219.6', size: '0.677', sum: '1.054', depthPercent: 15 },
  { price: '93219.5', size: '0.002', sum: '0.357', depthPercent: 10 },
  { price: '93219.4', size: '0.002', sum: '0.355', depthPercent: 20 },
  { price: '93219.3', size: '0.222', sum: '0.353', depthPercent: 40 },
  { price: '93217.7', size: '0.014', sum: '0.121', depthPercent: 30 },
  { price: '93216.7', size: '0.107', sum: '0.107', depthPercent: 25 }
];

const bidOrders: OrderBookEntry[] = [
  { price: '93215.8', size: '1.95K', sum: '1.95K', depthPercent: 80 },
  { price: '93215.0', size: '0.002', sum: '1.95K', depthPercent: 5 },
  { price: '93214.0', size: '0.002', sum: '1.95K', depthPercent: 5 },
  { price: '93213.1', size: '0.105', sum: '1.95K', depthPercent: 25 },
  { price: '93212.2', size: '0.210', sum: '1.95K', depthPercent: 40 },
  { price: '93209.9', size: '0.147', sum: '1.95K', depthPercent: 35 },
  { price: '93209.4', size: '0.002', sum: '1.95K', depthPercent: 5 }
];

const OrderBook: React.FC = () => {
  return (
    <div className="overflow-hidden flex flex-col">
      {/* Tab Header */}
      <div className="flex justify-between items-center p-2 border-b border-[#2A2A2A]">
        <div className="text-sm font-medium">Order Book</div>
        <button className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
      
      {/* Order Book Header */}
      <div className="grid grid-cols-3 text-xxs text-[#8A8A8A] p-2 border-b border-[#2A2A2A]">
        <div className="text-right">Price (USDT)</div>
        <div className="text-right">Size (BTC)</div>
        <div className="text-right">Sum (BTC)</div>
      </div>
      
      {/* Order Book Asks (Sell Orders) */}
      <div className="overflow-y-auto max-h-60">
        {askOrders.map((order, index) => (
          <div key={`ask-${index}`} className="grid grid-cols-3 text-xxs text-[#F6465D] p-1 relative">
            <div className="depth-red" style={{ width: `${order.depthPercent}%` }}></div>
            <div className="text-right z-10">{order.price}</div>
            <div className="text-right z-10">{order.size}</div>
            <div className="text-right z-10">{order.sum}</div>
          </div>
        ))}
        
        {/* Current Price */}
        <div className="grid grid-cols-1 text-sm font-medium text-[#F0B90B] p-1 bg-opacity-10 bg-[#F0B90B] border-t border-b border-[#2A2A2A]">
          <div className="text-center flex items-center justify-center">
            93215.8
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xxs ml-2">93217.7</span>
          </div>
        </div>
        
        {/* Order Book Bids (Buy Orders) */}
        {bidOrders.map((order, index) => (
          <div key={`bid-${index}`} className="grid grid-cols-3 text-xxs text-[#0ECB81] p-1 relative">
            <div className="depth-green" style={{ width: `${order.depthPercent}%` }}></div>
            <div className="text-right z-10">{order.price}</div>
            <div className="text-right z-10">{order.size}</div>
            <div className="text-right z-10">{order.sum}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
