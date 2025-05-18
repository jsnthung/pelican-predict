import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { generateStockData, generatePredictionData, StockDataPoint } from "@/assets/sample-data";

interface EchartsCandlestickChartProps {
  days?: number;
  startPrice?: number;
  volatility?: number;
  showPrediction?: boolean;
  predictionDays?: number;
}

const EchartsCandlestickChart: React.FC<EchartsCandlestickChartProps> = ({
  days = 30,
  startPrice = 200,
  volatility = 3,
  showPrediction = true,
  predictionDays = 7
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize ECharts instance
    chartInstance.current = echarts.init(chartRef.current);
    setIsLoading(false);

    // Generate stock data ending today
    const stockData = generateStockData(days, startPrice, volatility);
    
    // Generate prediction data if enabled
    let predictionData: StockDataPoint[] = [];
    if (showPrediction && stockData.length > 0) {
      const lastPoint = stockData[stockData.length - 1];
      
      // Generate prediction starting from the last historical point
      predictionData = generatePredictionData(
        lastPoint,
        predictionDays,
        volatility
      );
    }

    // Create a single unified array for dates on the x-axis
    const combinedDates = stockData.map((item) => {
      const date = new Date(item.x);
      return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    });

    // Add prediction dates if available
    if (predictionData.length > 0) {
      const predictionDates = predictionData.map((item) => {
        const date = new Date(item.x);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      });
      combinedDates.push(...predictionDates);
    }
    
    // Create data for historical candles
    const historicalData = stockData.map((item) => [item.o, item.c, item.l, item.h]);
    
    // Create data for prediction candles
    const predictionVisualData = predictionData.map((item) => [item.o, item.c, item.l, item.h]);
    
    // Set proper colors for the candlestick series based on data type
    const historicalItemStyle = {
      color: '#FD1050',      // Red for up candles
      color0: '#0CF49B',     // Green for down candles
      borderColor: '#FD1050',
      borderColor0: '#0CF49B'
    };

    const predictionItemStyle = {
      color: '#7B4DFF',      // Purple for up candles
      color0: '#00B0FF',     // Blue for down candles
      borderColor: '#7B4DFF',
      borderColor0: '#00B0FF'
    };
    
    // Convert data to continuous sequence for MA calculation
    const combinedPriceData = [
      ...stockData.map(item => item.c),
      ...predictionData.map(item => item.c)
    ];

    // Calculate moving averages
    function calculateMA(dayCount: number) {
      const result: (number | string)[] = [];
      for (let i = 0; i < combinedPriceData.length; i++) {
        if (i < dayCount) {
          result.push('-');
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += +combinedPriceData[i - j];
        }
        result.push(+(sum / dayCount).toFixed(2));
      }
      return result;
    }

    const option = {
      legend: {
        data: ['Historical', 'Prediction', 'MA5', 'MA10', 'MA20', 'MA30'],
        inactiveColor: '#777'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
          type: 'cross',
          lineStyle: {
            color: '#376df4',
            width: 2,
            opacity: 1
          }
        },
        formatter: function (params: any) {
          const candleParam = params[0];
          if (!candleParam) return '';
          
          const date = candleParam.axisValue;
          const isPrediction = candleParam.seriesName === 'Prediction';
          
          let result = `<div>${date} ${isPrediction ? '(Prediction)' : ''}</div>`;
          
          // Add each param
          params.forEach((param: any) => {
            if (param.value) {
              result += `<div style="color:${param.color}">
                ${param.seriesName}: ${typeof param.value === 'number' ? param.value : param.value[1]}
              </div>`;
            }
          });
          
          return result;
        }
      },
      xAxis: {
        type: 'category',
        data: combinedDates,
        axisLine: { lineStyle: { color: '#8392A5' } }
      },
      yAxis: {
        scale: true,
        axisLine: { lineStyle: { color: '#8392A5' } },
        splitLine: { show: false }
      },
      grid: {
        bottom: 80
      },
      dataZoom: [
        {
          textStyle: {
            color: '#8392A5'
          },
          handleIcon:
            'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          dataBackground: {
            areaStyle: {
              color: '#8392A5'
            },
            lineStyle: {
              opacity: 0.8,
              color: '#8392A5'
            }
          },
          brushSelect: true,
          start: Math.max(0, (1 - 30/combinedDates.length) * 100), // Start at last 30 days or all data
          end: 100 // End at most recent data
        },
        {
          type: 'inside'
        }
      ],
      series: [
        {
          type: 'candlestick',
          name: 'Historical',
          data: historicalData,
          itemStyle: historicalItemStyle
        },
        showPrediction && predictionVisualData.length > 0 ? {
          type: 'candlestick',
          name: 'Prediction',
          data: Array(stockData.length).fill('-').concat(predictionVisualData),
          itemStyle: predictionItemStyle
        } : null,
        {
          name: 'MA5',
          type: 'line',
          data: calculateMA(5),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: calculateMA(10),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        },
        {
          name: 'MA20',
          type: 'line',
          data: calculateMA(20),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        },
        {
          name: 'MA30',
          type: 'line',
          data: calculateMA(30),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        }
      ].filter(series => series !== null)
    };

    // Set chart option using type assertion to handle the incompatible types
    chartInstance.current.setOption(option as any);

    const resizeHandler = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chartInstance.current?.dispose();
    };
  }, [days, startPrice, volatility, showPrediction, predictionDays]);

  return (
    <div>
      {isLoading && <div>Loading chart...</div>}
      <div ref={chartRef} style={{ width: "800px", height: "400px" }}></div>
    </div>
  );
};

export default EchartsCandlestickChart; 