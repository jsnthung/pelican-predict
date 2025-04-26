import StockOverview from "@/containers/StockOverview";
import LandingPage from "./components/LandingPage";
import { useState } from "react";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      {/* Logo Section */}
      <LandingPage />
      {/* Main Content */}
      <StockOverview />
    </div>
  );
}

export default App;
