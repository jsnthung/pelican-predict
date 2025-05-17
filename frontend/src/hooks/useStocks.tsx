import { useState, useEffect } from 'react';
import axios from 'axios';

interface FinancialReport {
  _id: string;
  timestamp: string;
  stocks: Record<string, any>;
}

interface FundamentalAnalysis {
  _id: string;
  timestamp: string;
  stocks: Record<string, {
    recommendation: string;
    confidence: number;
    pro: string;
    con: string;
    summary: string;
  }>;
}

// API URL
const API_URL = 'http://localhost:8000';

export const useStocks = () => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [analysis, setAnalysis] = useState<FundamentalAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both data sources in parallel
      const [reportResponse, analysisResponse] = await Promise.all([
        axios.get<FinancialReport>(`${API_URL}/stocks/financial-reports`),
        axios.get<FundamentalAnalysis>(`${API_URL}/stocks/fundamental-analysis`)
      ]);
      
      setReport(reportResponse.data);
      setAnalysis(analysisResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get list of all stock tickers from financial report
  const stockTickers = report ? Object.keys(report.stocks) : [];

  // Get financial data for a specific stock ticker
  const getStockData = (ticker: string) => report?.stocks[ticker] || null;
  
  // Get analysis data for a specific stock ticker
  const getStockAnalysis = (ticker: string) => analysis?.stocks[ticker] || null;

  return {
    report,
    analysis,
    loading,
    error,
    refreshData: fetchData,
    stockTickers,
    getStockData,
    getStockAnalysis
  };
};