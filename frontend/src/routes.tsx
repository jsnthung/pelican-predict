import { createBrowserRouter } from "react-router-dom";
import StockOverview from "./containers/StockOverview";
import LandingPage from "./components/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/stock-overview",
    element: <StockOverview />,
  },
]); 