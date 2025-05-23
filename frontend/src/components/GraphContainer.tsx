import { useState } from 'react';
import EchartsCandlestickChart from '@/lib/components/EchartsCandlestickChart';

function GraphContainer({ history }: { stock: string, history: any[] }) {
  const [] = useState<'short' | 'long'>('long');
  const [days, setDays] = useState(60);
  const [showPrediction, setShowPrediction] = useState(true);

  // Map MongoDB data to chart format expected by EchartsCandlestickChart
  const mappedHistory = history.map(item => ({
    x: new Date(item.timestamp).getTime(),
    o: item.open,
    h: item.high,
    l: item.low,
    c: item.close,
  }));

  return (
    <div className="w-full bg-gray-700 rounded-lg p-4 space-y-4">
      
      {/* Top controls */}
      <div className="flex justify-between items-center">
        {/* Time period selection */}
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${days === 30 ? 'bg-gray-800' : 'bg-gray-600'}`}
            onClick={() => setDays(30)}
          >
            1M
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${days === 60 ? 'bg-gray-800' : 'bg-gray-600'}`}
            onClick={() => setDays(60)}
          >
            2M
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${days === 90 ? 'bg-gray-800' : 'bg-gray-600'}`}
            onClick={() => setDays(90)}
          >
            3M
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${days === 180 ? 'bg-gray-800' : 'bg-gray-600'}`}
            onClick={() => setDays(180)}
          >
            6M
          </button>
        </div>
      </div>

      {/* Prediction toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-300">7-Day Prediction:</span>
        <div 
          className={`relative w-10 h-5 rounded-full cursor-pointer ${showPrediction ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setShowPrediction(!showPrediction)}
        >
          <div 
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showPrediction ? 'transform translate-x-5' : ''}`}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex items-center justify-center">
        {mappedHistory.length === 0 ? (
          <div className="text-gray-300 text-lg py-12">Loading historical data...</div>
        ) : (
          <EchartsCandlestickChart 
            days={days}
            data={mappedHistory}
            showPrediction={showPrediction}
            predictionDays={7}
          />
        )}
      </div>
    </div>
  );
}

export default GraphContainer;
