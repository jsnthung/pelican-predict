import React, { useState } from 'react';
import StockOverviewView from '@/components/StockOverviewView';

function StockOverview() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [position, setPosition] = useState<'short' | 'long'>('long');

  return (
    <StockOverviewView
      selectedStock={selectedStock}
      position={position}
      onStockChange={setSelectedStock}
      onPositionChange={setPosition}
    />
  );
}

export default StockOverview;
