import React from "react";
import EchartsCandlestickChart from "./lib/components/EchartsCandlestickChart";

function App() {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Price Chart with Prediction</h1>
      <EchartsCandlestickChart 
        days={120} 
        startPrice={150} 
        volatility={20} 
        showPrediction={true}
        predictionDays={7}
      />
    </div>
  );
}

export default App;
