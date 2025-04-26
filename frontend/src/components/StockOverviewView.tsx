import React from 'react';

type StockOverviewViewProps = {
  selectedStock: string;
  position: 'short' | 'long';
  onStockChange: (stock: string) => void;
  onPositionChange: (position: 'short' | 'long') => void;
};

function StockOverviewView({
  selectedStock,
  position,
  onStockChange,
  onPositionChange,
}: StockOverviewViewProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      
      {/* Top controls */}
      <div className="flex justify-between items-center gap-x-4">
        {/* Stock Dropdown */}
        <select
          value={selectedStock}
          onChange={(e) => onStockChange(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="AAPL">AAPL</option>
          <option value="GOOG">GOOG</option>
          <option value="TSLA">TSLA</option>
        </select>

        {/* Segmented Control */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            className={`px-4 py-2 ${position === 'short' ? 'bg-gray-300' : ''}`}
            onClick={() => onPositionChange('short')}
          >
            Short
          </button>
          <button
            className={`px-4 py-2 ${position === 'long' ? 'bg-gray-300' : ''}`}
            onClick={() => onPositionChange('long')}
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

export default StockOverviewView;
