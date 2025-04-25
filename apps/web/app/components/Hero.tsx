'use client';

import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-70"></div>
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTAgMGgxMHYxMEgwek0xMiAwaDEwdjEwSDEyek0yNCAwaDEwdjEwSDI0ek0zNiAwaDEwdjEwSDM2ek00OCAwaDEwdjEwSDQ4ek0wIDEyaDEwdjEwSDB6TTEyIDEyaDEwdjEwSDEyek0yNCAxMmgxMHYxMEgyNHpNMzYgMTJoMTB2MTBIMzZ6TTQ4IDEyaDEwdjEwSDQ4ek0wIDI0aDEwdjEwSDB6TTEyIDI0aDEwdjEwSDEyek0yNCAyNGgxMHYxMEgyNHpNMzYgMjRoMTB2MTBIMzZ6TTQ4IDI0aDEwdjEwSDQ4ek0wIDM2aDEwdjEwSDB6TTEyIDM2aDEwdjEwSDEyek0yNCAzNmgxMHYxMEgyNHpNMzYgMzZoMTB2MTBIMzZ6TTQ4IDM2aDEwdjEwSDQ4ek0wIDQ4aDEwdjEwSDB6TTEyIDQ4aDEwdjEwSDEyek0yNCA0OGgxMHYxMEgyNHpNMzYgNDhoMTB2MTBIMzZ6TTQ4IDQ4aDEwdjEwSDQ4eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="w-full flex flex-col items-center text-center opacity-100 transform translate-y-0 transition-all duration-800">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            <span className="block opacity-100 transform translate-x-0 transition-all duration-500">
              Trade Crypto
            </span>
            <span className="block text-gradient opacity-100 transform translate-x-0 transition-all duration-500">
              Futures
            </span>
          </h1>
          <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl mb-8 opacity-100 transition-all duration-500 max-w-2xl">
            Trade Bitcoin, Ethereum and other cryptocurrencies with up to 125x leverage. 
            Low fees, deep liquidity, and industry-leading security.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="mt-4 md:mt-0">
              <button 
                className="w-full md:w-auto bg-gradient-to-r from-yellow-500 to-yellow-400 px-8 py-4 rounded-xl text-base font-medium text-black shadow-glow hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-105 active:scale-95"
              >
                Start Trading Now
              </button>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                className="w-full md:w-auto bg-transparent border-2 border-yellow-500 px-8 py-4 rounded-xl text-base font-medium text-white shadow-glow hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-105 active:scale-95"
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="w-full max-w-4xl glass-effect p-6 rounded-xl border border-gray-800/50 hover:border-yellow-500/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.1),_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:bg-yellow-500/30 transition-all duration-300 shadow-lg group-hover:shadow-yellow-500/20">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">₿</span>
                </div>
                <div>
                  <h3 className="font-display font-medium text-xl text-white group-hover:text-yellow-500 transition-colors duration-300">BTC/USDT</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Bitcoin / Tether</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors duration-300">$42,850.00</span>
                <span className="text-green-500 group-hover:scale-110 transition-transform duration-300 bg-green-500/10 px-2 py-1 rounded-full">+2.45%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;