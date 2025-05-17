import GraphContainer from './GraphContainer';
import ReasonContainer from './ReasonContainer';
import { useStocks } from '../hooks/useStocks';

type StockOverviewViewProps = {
  selectedStock: string;
  onStockChange: (stock: string) => void;
};

function StockOverviewView({ selectedStock, onStockChange }: StockOverviewViewProps) {
  const { report, loading, error, stockTickers, getStockData } = useStocks();
  
  const stockData = getStockData(selectedStock);
  const fundamentals = stockData?.fundamentals;
  
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
        {/* Reasoning for Graph */}
        <ReasonContainer title="Reasoning for Graph" reason="reason parameter graph" />
    
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
        )}
        {/* Reasoning for Fundamentals */}
        <ReasonContainer title="Fundamentals Analysis" reason="Based on the financial data, this stock shows key metrics including P/E ratio, profit margins, and recent revenue performance." />
      </div>
    </div>
  );
}

export default StockOverviewView;
