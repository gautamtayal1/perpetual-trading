import { MoreHorizontal } from "lucide-react";
import OrderEntry from "./OrderEntry";

interface OrderData {
  price: string;
  size: string;
}

// Static order book data to match the screenshot
const sellOrders: OrderData[] = [
  { price: "92859.2", size: "0.043" },
  { price: "92859.1", size: "0.400" },
  { price: "92859.0", size: "0.002" },
  { price: "92858.9", size: "0.004" },
  { price: "92858.8", size: "0.023" },
  { price: "92859.2", size: "0.043" },
  { price: "92859.1", size: "0.400" },
  { price: "92859.0", size: "0.002" },
  { price: "92858.9", size: "0.004" },
  { price: "92858.8", size: "0.023" },
  { price: "92859.1", size: "0.400" },
  { price: "92859.0", size: "0.002" },
  { price: "92858.9", size: "0.004" },
  { price: "92858.8", size: "0.023" },
];

const buyOrders: OrderData[] = [
  { price: "92858.5", size: "2.405" },
  { price: "92858.4", size: "0.188" },
  { price: "92858.3", size: "0.002" },
  { price: "92858.2", size: "0.002" },
  { price: "92858.1", size: "0.002" },
  { price: "92858.5", size: "2.405" },
  { price: "92858.4", size: "0.188" },
  { price: "92858.3", size: "0.002" },
  { price: "92858.2", size: "0.002" },
  { price: "92858.1", size: "0.002" },
  { price: "92858.4", size: "0.188" },
  { price: "92858.3", size: "0.002" },
  { price: "92858.2", size: "0.002" },
  { price: "92858.1", size: "0.002" },
];

const OrderBook = () => {
  return (
    <div className="bg-[#1A1A1A] rounded-md flex flex-col h-full text-white">
      {/* OrderBook Section - Top Half */}
      <div className="h-45/100">
        <div className="p-3 border-b border-[#2A2A2A] flex justify-between">
          <h3 className="font-medium">Order Book</h3>
          <button>
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        {/* Side by side order books */}
        <div className="flex h-[calc(100%-40px)]">
          {/* Sell Orders - Left Side */}
          <div className="w-1/2 border-r border-[#2A2A2A]">
            {/* Sell Header */}
            <div className="px-3 py-1 grid grid-cols-2 text-xs text-gray-400">
              <div>Price (USDT)</div>
              <div className="text-right">Size (BTC)</div>
            </div>
            
            {/* Sell Orders List */}
            <div className="overflow-y-auto" style={{ maxHeight: "160px" }}>
              {sellOrders.map((order, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1 grid grid-cols-2 text-xs hover:bg-[#212121] relative"
                >
                  <div className="text-red-500 z-10">{order.price}</div>
                  <div className="text-right z-10">{order.size}</div>
                  <div 
                    className="absolute top-0 right-0 h-full bg-red-800/10" 
                    style={{ width: `${Math.min(parseFloat(order.size) * 30, 100)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Buy Orders - Right Side */}
          <div className="w-1/2">
            {/* Buy Header */}
            <div className="px-3 py-1 grid grid-cols-2 text-xs text-gray-400">
              <div>Price (USDT)</div>
              <div className="text-right">Size (BTC)</div>
            </div>
            
            {/* Buy Orders List */}
            <div className="overflow-y-auto" style={{ maxHeight: "160px" }}>
              {buyOrders.map((order, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1 grid grid-cols-2 text-xs hover:bg-[#212121] relative"
                >
                  <div className="text-green-500 z-10">{order.price}</div>
                  <div className="text-right z-10">{order.size}</div>
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-800/10" 
                    style={{ width: `${Math.min(parseFloat(order.size) * 30, 100)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>  
      </div>
      
      {/* Order Entry Form - Bottom Half */}
      <div className="h-55/100 border-t border-[#2A2A2A]">
        <OrderEntry />
      </div>
    </div>
  );
};

export default OrderBook;
