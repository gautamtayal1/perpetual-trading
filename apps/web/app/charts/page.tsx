'use client'

import { useEffect, useRef, useState } from 'react';
import * as LightweightCharts from 'lightweight-charts';

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    try {
      // Log the library version to help with debugging
      console.log('LightweightCharts:', LightweightCharts);
      
      const chart = LightweightCharts.createChart(chartContainerRef.current, {
        width: 800,
        height: 400,
        layout: {
          background: { color: '#14151a' },
          textColor: '#c7d0d9',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#363C4E' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Common data format for all versions
      const sampleData = [
        { time: '2024-04-17', open: 62400, high: 63000, low: 61900, close: 62800 },
        { time: '2024-04-18', open: 62800, high: 63200, low: 62500, close: 63100 },
        { time: '2024-04-19', open: 63100, high: 63700, low: 62800, close: 63350 },
        { time: '2024-04-20', open: 63350, high: 63500, low: 62200, close: 62600 },
        { time: '2024-04-21', open: 62600, high: 62900, low: 62000, close: 62150 },
        { time: '2024-04-22', open: 62150, high: 62500, low: 61500, close: 61700 },
        { time: '2024-04-23', open: 61700, high: 62200, low: 61400, close: 61850 },
      ];
      
      let candleSeries;
      
      // Try multiple API approaches to handle different versions
      try {
        // Version 4.x (latest)
        // @ts-expect-error - Method may exist in runtime but not in type definitions
        candleSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: true,
          wickVisible: true,
          borderUpColor: '#26a69a',
          borderDownColor: '#ef5350',
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
      } catch (e1) {
        console.log('First approach failed:', e1);
        try {
          // Alternative approach for some versions
          candleSeries = chart.addSeries('candlestick', {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
        } catch (e2) {
          console.log('Second approach failed:', e2);
          // Last resort for older versions (v3.x and below)
          candleSeries = chart.createSeries('candlestick', {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
        }
      }

      candleSeries.setData(sampleData);
      chart.timeScale().fitContent();

      return () => {
        chart.remove();
      };
    } catch (err) {
      console.error('Chart initialization error:', err);
      setError('Failed to initialize chart. Please check console for details.');
    }
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <p className="text-red-700">{error}</p>
        <p className="mt-2 text-sm">
          Try installing the latest version of lightweight-charts:
          <br />
          <code className="bg-gray-100 px-2 py-1 mt-1 block">npm install lightweight-charts@latest</code>
        </p>
      </div>
    );
  }

  return <div ref={chartContainerRef} className="border border-gray-300 rounded" />;
}