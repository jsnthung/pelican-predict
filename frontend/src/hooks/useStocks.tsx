import { useState, useEffect } from 'react';
import axios from 'axios';

interface FinancialReport {
  _id: string;
  timestamp: string;
  stocks: Record<string, any>;
}

// API URL
const API_URL = 'http://localhost:8000';

export const useStocks = () => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get<FinancialReport>(`${API_URL}/stocks/financial-reports`);
      setReport(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching financial report:', err);
      setError('Failed to fetch financial report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialReport();
  }, []);

  return {
    report,
    loading,
    error,
    refreshReport: fetchFinancialReport,
    // Get a list of stock tickers from the report
    stockTickers: report ? Object.keys(report.stocks) : [],
    // Helper to get specific stock data
    getStockData: (ticker: string) => report?.stocks[ticker] || null
  };
};