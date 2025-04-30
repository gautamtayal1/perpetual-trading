'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    LightweightCharts: {
      createChart: (
        container: HTMLElement,
        options: any
      ) => {
        addCandlestickSeries: (options: any) => any;
        resize: (width: number, height: number) => void;
        remove: () => void;
      };
    }
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

  useEffect(() => {
    if (!scriptLoaded || !chartContainerRef.current) return
    
    try {
      const container = chartContainerRef.current
      if (!window.LightweightCharts) {
        console.error('LightweightCharts is not loaded')
        return
      }

      // Apply background directly to container first
      if (chartContainerRef.current) {
        chartContainerRef.current.style.backgroundColor = '#000000';
      }

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

      if (typeof chart.addCandlestickSeries !== 'function') {
        console.error('addCandlestickSeries is not available')
        return
      }

      const chartElement = container.querySelector('.tv-lightweight-charts') as HTMLElement;
      if (chartElement) {
        chartElement.style.backgroundColor = '#000000';
      }

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
      })

      ;(async () => {
        const realData = await fetch(
          'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=500'
        ).then(r => r.json())
        // transform the array of arrays into { time, open, high, low, close }
        const chartData = realData.map(c => ({
          time: c[0] / 1000,
          open: +c[1],
          high: +c[2],
          low: +c[3],
          close: +c[4],
        }))
        candleSeries.setData(chartData)
      })()

      const handleResize = () => {
        chart.resize(container.clientWidth, container.clientHeight)
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chart.remove()
      }
    } catch (error) {
      console.error('Error initializing chart:', error)
    }
  }, [scriptLoaded])

  return (
    <div className="chart-wrapper" style={{ width, height, backgroundColor: '#000000', padding: 0, margin: 0 }}>
      <Script
        src="https://unpkg.com/lightweight-charts@4.0.1/dist/lightweight-charts.standalone.production.js"
        onLoad={() => setScriptLoaded(true)}
        onError={(e) => console.error('Script failed to load:', e)}
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
