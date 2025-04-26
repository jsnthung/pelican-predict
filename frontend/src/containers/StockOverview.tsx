import React, { useState } from 'react';
import StockOverviewView from '@/components/StockOverviewView';

function StockOverview() {
  const [selectedStock, setSelectedStock] = useState('AAPL');

  return (
    <StockOverviewView
      selectedStock={selectedStock}
      onStockChange={setSelectedStock}
    />
  );
}

export default StockOverview;
