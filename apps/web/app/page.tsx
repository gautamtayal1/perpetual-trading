
import React from 'react'
import BinanceHeader from './components/Header'
import Footer from './components/Footer'
import PriceTicker from './components/PriceTicker';
import Hero from './components/Hero'

const page = () => {
  return (
  
      <div className="min-h-screen bg-black text-white flex flex-col">
        <BinanceHeader />
        <main className="flex-grow">
          <Hero />
          <PriceTicker />
        </main>
        <Footer />
      </div>

  )
}

export default page