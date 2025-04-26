import datetime as dt
from typing import Dict,List

import yfinance as yf
import pandas as pd
from alpaca.data.historical.news import NewsClient
from alpaca.data.requests import NewsRequest

YEARS_OF_FINANCIALS = 4
NEWS_LIMIT = 15

def fetch_fundamentals(ticker:str) -> Dict[str, Dict]:
    tk = yf.Ticker(ticker)

    # Get financial statements (Income statement & balance sheet)
    inc = tk.income_stmt.T.head(YEARS_OF_FINANCIALS).fillna(0).astype(float)
    bal = tk.balance_sheet.T.head(YEARS_OF_FINANCIALS).fillna(0).astype(float)

    # Select only the important rows
    inc_cols = [col for col in [
        "Total Revenue",
        "Gross Profit",
        "Operating Income",
        "Net Income"
    ] if col in inc.columns]

    bal_cols = [col for col in [
        "Total Assets",
        "Total Liab",
        "Total Stockholder Equity",
        "Total Debt"
    ] if col in bal.columns]

    inc_trimmed = inc[inc_cols].rename_axis("FiscalYear").astype(float).to_dict()
    bal_trimmed = bal[bal_cols].rename_axis("FiscalYear").astype(float).to_dict()

    # Calculate Historical Book Values = Total Assets - Total Liabilities
    try:
        book_values = (bal["Total Assets"] - bal["Total Liab"]).to_dict()
    except Exception:
        book_values = {}

    # Calculate historical P/E Ratios
    try:
        hist_prices = tk.history(period="5y", interval="1d")["Close"]

        # Estimate shares outstanding (assuming stable)
        shares_outstanding = tk.info.get("sharesOutstanding", None)

        hist_pe = {}

        if shares_outstanding:
            for fiscal_date in inc.index:
                fiscal_date_str = fiscal_date.strftime("%Y-%m-%d")

                # Find closest available price before fiscal year end
                price = hist_prices[:fiscal_date_str].iloc[-1] if fiscal_date_str in hist_prices.index else None

                net_income = inc.at[fiscal_date, "Net Income"] if "Net Income" in inc.columns else None

                if price and net_income:
                    eps = net_income / shares_outstanding
                    pe = price / eps if eps != 0 else None
                    hist_pe[fiscal_date_str] = pe
    except Exception:
        hist_pe = {}

    return {
        "income": inc_trimmed,
        "balance": bal_trimmed,
        "trailingPE": tk.info.get("trailingPE"),
        "currentPBV": tk.info.get("priceToBook"),
        "bookValueHistory":book_values,
        "historicalPE": hist_pe,
    }
