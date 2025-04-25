"use client"
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const BinanceHeader: React.FC = () => {
  const { data: session } = useSession()

  return (
    <header className="flex items-center justify-between border-b border-[#2A2A2A] p-5 h-16">
      <div className="flex items-center">
        <a href="/" className="flex items-center">
          <img src="https://public.bnbstatic.com/static/images/common/favicon.ico" alt="Binance" className="w-5 h-5 mr-2" />
          <span className="text-[#F0B90B] font-medium">BINANCE &nbsp;FUTURES</span>
        </a>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-8">
        <a href="/trade" className="text-gray-300 hover:text-white text-sm">Spot</a>
        <a href="/trade" className="text-gray-300 hover:text-white text-sm">Futures</a>
        <a href="/trade" className="text-gray-300 hover:text-white text-sm">Earn</a>
        <a href="/trade" className="text-gray-300 hover:text-white text-sm">NFT</a>
      </div>
      
      <div className="flex items-center space-x-4">
        {session ? (
          <button 
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300" 
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        ) : (
          <button 
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300" 
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default BinanceHeader;
