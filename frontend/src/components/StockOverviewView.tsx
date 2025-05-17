import GraphContainer from './GraphContainer';
import ReasonContainer from './ReasonContainer';
import NewsCard from './NewsCard';
import TechnicalAnalysisView from './TechnicalAnalysisView';
import { useStocks } from '../hooks/useStocks';

type StockOverviewViewProps = {
  selectedStock: string;
  onStockChange: (stock: string) => void;
};

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
}

function StockOverviewView({ selectedStock, onStockChange }: StockOverviewViewProps) {
  const { report, analysis, technicalAnalysis, loading, error, stockTickers, getStockData, getStockAnalysis } = useStocks();
  
  const stockData = getStockData(selectedStock);
  const fundamentals = stockData?.fundamentals;
  const news = stockData?.news || [];
  const stockAnalysis = getStockAnalysis(selectedStock);
  
  // Format large numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    return `$${(num / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center p-6 space-y-12">
      
      {/* Top controls */}
      <div className="flex items-center bg-gray-800 rounded-full p-3 w-full max-w-md">
        {/* Stock Dropdown */}
        <div className="flex items-center justify-center w-full">	
          <select
            value={selectedStock}
            onChange={(e) => onStockChange(e.target.value)}
            className="bg-gray-800 text-gray-300 text-base focus:outline-none w-full px-4"
          >
            {stockTickers.map(ticker => (
              <option key={ticker} value={ticker}>{ticker}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Graph Section */}
      <div className="w-full max-w-5xl space-y-6">
        <h1 className="text-2xl font-bold">Technical Analysis:</h1>
        <GraphContainer stock={selectedStock} />
        
        {/* Technical Analysis */}
        {loading ? (
          <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-300 font-semibold">Loading technical analysis...</p>
          </div>
        ) : error ? (
          <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-300 font-semibold">Error loading data: {error}</p>
          </div>
        ) : technicalAnalysis ? (
          <TechnicalAnalysisView
            recommendation={technicalAnalysis.forecast.recommendation}
            confidenceLevel={technicalAnalysis.forecast.confidence_level}
            reasoning={technicalAnalysis.forecast.reasoning}
          />
        ) : (
          <ReasonContainer title="Reasoning for Graph" reason="Technical analysis data not available" />
        )}
      </div>

      {/* Table Section */}
      <div className="w-full max-w-5xl space-y-6">
        <h1 className="text-2xl font-bold">Fundamental Analysis:</h1>
        {loading ? (
          <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-300 font-semibold">Loading financial data...</p>
          </div>
        ) : error ? (
          <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-300 font-semibold">Error loading data: {error}</p>
          </div>
        ) : !fundamentals ? (
          <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-300 font-semibold">No financial data available for {selectedStock}</p>
          </div>
        ) : (
          <>
            {/* AI Analysis */}
            {stockAnalysis && (
              <div className="w-full bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Recommendation:</span>
                    <span className={`font-semibold ${
                      stockAnalysis.recommendation.toLowerCase().includes('buy') ? 'text-green-400' : 
                      stockAnalysis.recommendation.toLowerCase().includes('sell') ? 'text-red-400' : 
                      'text-yellow-400'
                    }`}>
                      {stockAnalysis.recommendation}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="font-semibold">{stockAnalysis.confidence}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Summary</h3>
                  <p className="text-gray-300">{stockAnalysis.summary}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-green-400 font-medium mb-2">Pros</h3>
                    <p className="text-gray-300">{stockAnalysis.pro}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-red-400 font-medium mb-2">Cons</h3>
                    <p className="text-gray-300">{stockAnalysis.con}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Financial Data */}
            <div className="w-full bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Metrics */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Financial Metrics</h2>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="py-2 text-gray-400">Trailing P/E</td>
                        <td className="py-2 text-right">{fundamentals.trailingPE?.toFixed(2) || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2 text-gray-400">Price-to-Book</td>
                        <td className="py-2 text-right">{fundamentals.currentPBV?.toFixed(2) || 'N/A'}</td>
                      </tr>
                      {fundamentals.margins && fundamentals.margins["2024-09-30"] && (
                        <>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-400">Gross Margin</td>
                            <td className="py-2 text-right">{(fundamentals.margins["2024-09-30"].grossMargin * 100).toFixed(2)}%</td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-400">Operating Margin</td>
                            <td className="py-2 text-right">{(fundamentals.margins["2024-09-30"].operatingMargin * 100).toFixed(2)}%</td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-400">Net Margin</td>
                            <td className="py-2 text-right">{(fundamentals.margins["2024-09-30"].netMargin * 100).toFixed(2)}%</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Income Statement */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Income Statement (Latest Year)</h2>
                  <table className="w-full text-sm">
                    <tbody>
                      {fundamentals.income && (
                        <>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-400">Revenue</td>
                            <td className="py-2 text-right">
                              {fundamentals.income["Total Revenue"] && 
                                formatNumber(Object.values(fundamentals.income["Total Revenue"])[0] as number)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-400">Gross Profit</td>
                            <td className="py-2 text-right">
                              {fundamentals.income["Gross Profit"] && 
                                formatNumber(Object.values(fundamentals.income["Gross Profit"])[0] as number)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-400">Operating Income</td>
                            <td className="py-2 text-right">
                              {fundamentals.income["Operating Income"] && 
                                formatNumber(Object.values(fundamentals.income["Operating Income"])[0] as number)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-400">Net Income</td>
                            <td className="py-2 text-right">
                              {fundamentals.income["Net Income"] && 
                                formatNumber(Object.values(fundamentals.income["Net Income"])[0] as number)}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* News Section */}
      {news.length > 0 && (
        <div className="w-full max-w-5xl space-y-6">
          <h1 className="text-2xl font-bold">Latest News</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item: NewsItem, index: number) => (
              <NewsCard 
                key={index}
                headline={item.headline}
                summary={item.summary}
                url={item.url}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StockOverviewView;
