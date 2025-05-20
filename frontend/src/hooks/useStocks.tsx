import { useState, useEffect } from 'react';
import axios from 'axios';

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
}

interface FinancialReport {
  _id: string;
  timestamp: string;
  stocks: Record<string, {
    fundamentals: any;
    news: NewsItem[];
  }>;
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

interface ForecastDay {
  day: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trade_count: number;
  vwap: number;
}

interface SupportingPoint {
  type: 'high' | 'low';
  day: string;
  high: number;
  low: number;
}

interface Pattern {
  pattern_name: string;
  supporting_points: SupportingPoint[];
}

interface StockForecast {
  weekly_forecast: ForecastDay[];
  recommendation: string;
  confidence_level: number;
  reasoning: string;
  detected_patterns: Pattern[];
}

interface TechnicalAnalysis {
  _id: string;
  timestamp: string;
  stocks: Record<string, StockForecast>;
}

interface StockHistoryPoint {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  [key: string]: any; // For any additional fields
}

interface StockHistory {
  _id: string;
  timestamp: string;
  data?: StockHistoryPoint[];
  stocks?: Record<string, StockHistoryPoint[]>;
}

// API URL
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useStocks = () => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [analysis, setAnalysis] = useState<FundamentalAnalysis | null>(null);
  const [technicalAnalysis, setTechnicalAnalysis] = useState<TechnicalAnalysis | null>(null);
  const [history, setHistory] = useState<StockHistory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all data sources in parallel
      const [reportResponse, analysisResponse, technicalResponse, historyResponse] = await Promise.all([
        axios.get<FinancialReport>(`${API_URL}/stocks/financial-reports`),
        axios.get<FundamentalAnalysis>(`${API_URL}/stocks/fundamental-analysis`),
        axios.get<TechnicalAnalysis>(`${API_URL}/stocks/technical-analysis`),
        axios.get<StockHistory>(`${API_URL}/stocks/stock-history`)
      ]);
      
      setReport(reportResponse.data);
      setAnalysis(analysisResponse.data);
      setTechnicalAnalysis(technicalResponse.data);
      setHistory(historyResponse.data);
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
  
  // Get fundamental analysis data for a specific stock ticker
  const getStockAnalysis = (ticker: string) => analysis?.stocks[ticker] || null;
  
  // Get technical analysis data for a specific stock ticker
  const getStockForecast = (ticker: string) => technicalAnalysis?.stocks[ticker] || null;
  
  // Get historical data for a specific stock ticker
  const getStockHistory = (ticker: string) => {
    if (!history) return [];

    // New structure: data is a dict of symbols
    if (history.data && typeof history.data === 'object' && !Array.isArray(history.data) && history.data[ticker]) {
      return history.data[ticker];
    }
    // Previous structure: stocks dictionary
    if (history.stocks && history.stocks[ticker]) {
      return history.stocks[ticker];
    }
    // Old structure: data is an array
    if (Array.isArray(history.data)) {
      return history.data.filter(item => item.symbol === ticker);
    }
    return [];
  };

  // Generate a new technical analysis
  const generateTechnicalAnalysis = async (tickers?: string[]) => {
    try {
      await axios.post(`${API_URL}/stocks/technical-analysis/generate`, { symbols: tickers });
      // Wait a bit to give time for the analysis to complete
      setTimeout(fetchData, 5000);
      return true;
    } catch (err) {
      console.error('Error generating technical analysis:', err);
      return false;
    }
  };

  return {
    report,
    analysis,
    technicalAnalysis,
    history,
    loading,
    error,
    refreshData: fetchData,
    stockTickers,
    getStockData,
    getStockAnalysis,
    getStockForecast,
    getStockHistory,
    generateTechnicalAnalysis
  };
};