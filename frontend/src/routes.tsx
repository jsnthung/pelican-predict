import {createHashRouter } from "react-router-dom";
import StockOverview from "./containers/StockOverview";
import LandingPage from "./components/LandingPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/stock-overview",
    element: <StockOverview />,
  },
]); 