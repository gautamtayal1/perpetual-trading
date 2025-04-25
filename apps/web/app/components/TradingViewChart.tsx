'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    LightweightCharts: any
  }
}

export default function LightweightCandlestickChart({
  width = '100%',
  height = '500px',
}: {
  width?: string
  height?: string
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // simple sample data generator
  function generateCandlestickData() {
    const data: { time: number; open: number; high: number; low: number; close: number }[] = []
    let t = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30 
    let prevClose = 50
    for (let i = 0; i < 5000; i++) {
      const open = prevClose + (Math.random() - 0.5) * 200
      const high = open + Math.random() * 200
      const low = open - Math.random() * 200
      const close = low + Math.random() * (high - low)
      data.push({ time: t + i * 60 * 60, open, high, low, close })
      prevClose = close
    }
    return data
  }

  useEffect(() => {
    if (!scriptLoaded || !chartContainerRef.current) return
    
    // Apply background directly to container first
    if (chartContainerRef.current) {
      chartContainerRef.current.style.backgroundColor = '#000000';
    }

    const container = chartContainerRef.current
    const chart = window.LightweightCharts.createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { 
          type: 'solid', 
          color: '#000000' 
        },
        backgroundColor: '#000000',
        textColor: '#8A8A8A',
      },
      grid: {
        vertLines: { color: '#333333', style: 1 },
        horzLines: { color: '#333333', style: 1 },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#000000',
        backgroundColor: '#000000',
      },
    })

    // Apply additional styling to ensure black background
    const chartElement = container.querySelector('.tv-lightweight-charts') as HTMLElement;
    if (chartElement) {
      chartElement.style.backgroundColor = '#000000';
    }

    const candleSeries = chart.addSeries(window.LightweightCharts.CandlestickSeries)
    candleSeries.setData(generateCandlestickData())

    const handleResize = () => {
      chart.resize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [scriptLoaded])

  return (
    <div className="chart-wrapper" style={{ width, height, backgroundColor: '#000000', padding: 0, margin: 0 }}>
      <Script
        src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <div
        ref={chartContainerRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#000000',
          position: 'relative',
          overflow: 'hidden'
        }}
      />
    </div>
  )
}
