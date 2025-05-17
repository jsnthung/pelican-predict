import GraphContainer from './GraphContainer';
import ReasonContainer from './ReasonContainer';

type StockOverviewViewProps = {
  selectedStock: string;
  onStockChange: (stock: string) => void;
};

function StockOverviewView({ selectedStock, onStockChange }: StockOverviewViewProps) {
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
          <option value="AAPL">AAPL</option>
          <option value="GOOG">GOOG</option>
          <option value="TSLA">TSLA</option>
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
        <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-300 font-semibold">Financial Table Placeholder</p>
        </div>
        {/* Reasoning for Graph */}
        <ReasonContainer title="Table Reasoning" reason="reason parameter Table" />
      </div>

    </div>
  );
}

export default StockOverviewView;
