import React from "react";
import CandlestickChart from "./lib/components/CandlestickChart";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CandlestickChart />
    </div>
  );
}

export default App;
