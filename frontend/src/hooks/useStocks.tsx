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

interface TechnicalAnalysis {
  _id: string;
  timestamp: string;
  forecast: {
    recommendation: string;
    confidence_level: number;
    reasoning: string;
    weekly_forecast: any[];
    detected_patterns: any[];
  };
}

// API URL
const API_URL = 'http://localhost:8000';

export const useStocks = () => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [analysis, setAnalysis] = useState<FundamentalAnalysis | null>(null);
  const [technicalAnalysis, setTechnicalAnalysis] = useState<TechnicalAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all data sources in parallel
      const [reportResponse, analysisResponse, techResponse] = await Promise.all([
        axios.get<FinancialReport>(`${API_URL}/stocks/financial-reports`),
        axios.get<FundamentalAnalysis>(`${API_URL}/stocks/fundamental-analysis`),
        axios.get<TechnicalAnalysis>(`${API_URL}/stocks/technical-analysis`)
      ]);
      
      setReport(reportResponse.data);
      setAnalysis(analysisResponse.data);
      setTechnicalAnalysis(techResponse.data);
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
    technicalAnalysis,
    loading,
    error,
    refreshData: fetchData,
    stockTickers,
    getStockData,
    getStockAnalysis
  };
};