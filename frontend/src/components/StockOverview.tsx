import React, { useState } from 'react';

function StockOverview() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [position, setPosition] = useState<'short' | 'long'>('long');

  return (
    <div className="p-6 space-y-6">
      
      {/* Top controls */}
      <div className="flex justify-between items-center">
        {/* Stock Dropdown */}
        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="AAPL">AAPL</option>
          <option value="NVDA">NVDA</option>
          <option value="TSLA">TSLA</option>
        </select>

        {/* Segmented Control */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            className={`px-4 py-2 ${position === 'short' ? 'bg-gray-300' : ''}`}
            onClick={() => setPosition('short')}
          >
            Short
          </button>
          <button
            className={`px-4 py-2 ${position === 'long' ? 'bg-gray-300' : ''}`}
            onClick={() => setPosition('long')}
          >
            Long
          </button>
        </div>
      </div>

      {/* Graph Section */}
      <div className="space-y-2">
        <div className="w-full h-64 bg-blue-200 flex items-center justify-center">
          Stock Graph Placeholder
        </div>
        <div>
          <h2 className="font-semibold">Reasoning:</h2>
          <p className="text-gray-600">Explain the stock graph here...</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="space-y-2">
        <div className="w-full h-48 bg-green-200 flex items-center justify-center">
          Financial Table Placeholder
        </div>
        <div>
          <h2 className="font-semibold">Reasoning:</h2>
          <p className="text-gray-600">Explain the financial table here...</p>
        </div>
      </div>

    </div>
  );
}

export default StockOverview;
