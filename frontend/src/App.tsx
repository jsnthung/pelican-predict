import { Button } from "@/components/ui/button";
import StockOverview from "@/components/StockOverview";
import { useState } from "react";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <StockOverview />
    </div>
  );
}

export default App;
