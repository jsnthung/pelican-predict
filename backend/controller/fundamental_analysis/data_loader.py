import datetime as dt
import os
from typing import Dict,List

import yfinance as yf
import pandas as pd
import numpy as np
from alpaca.data.historical.news import NewsClient
from alpaca.data.requests import NewsRequest
from pathlib import Path
from dotenv import load_dotenv

# load env file since it is one dir above
env_path = Path(__file__).parent.parent.parent / '.env'  # Changed to go up two directories to reach /backend
print(f"Looking for .env file at: {env_path}")
load_dotenv(dotenv_path=env_path)

# silence unecessary pd warnings
pd.set_option('future.no_silent_downcasting', True)

YEARS_OF_FINANCIALS = 4
NEWS_LIMIT = 15

def fetch_fundamentals(ticker:str) -> Dict[str, Dict]:
    tk = yf.Ticker(ticker)

    # Get financial statements (Income statement & balance sheet)
    inc = tk.income_stmt.T.head(YEARS_OF_FINANCIALS)
    inc = inc.fillna(0).infer_objects(copy=False)

    bal = tk.balance_sheet.T.head(YEARS_OF_FINANCIALS)
    bal = bal.fillna(0).infer_objects(copy=False)

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

    # Calculations using helper functions
    book_values = calculate_book_values(bal)
    hist_pe = calculate_historical_pe(inc, tk)
    margins = calculate_margins(inc)
    debt_to_equity = calculate_debt_to_equity(bal)

    return {
        "income": inc_trimmed,
        "balance": bal_trimmed,
        "trailingPE": tk.info.get("trailingPE"),
        "currentPBV": tk.info.get("priceToBook"),
        "bookValueHistory": book_values,
        "historicalPE": hist_pe,
        "margins": margins,
        "debtToEquityHistory": debt_to_equity,
    }

def calculate_book_values(bal):
    try:
        return (bal["Total Assets"] - bal["Total Liab"]).to_dict()
    except Exception:
        return {}

def calculate_historical_pe(inc, tk):
    try:
        hist_prices = tk.history(period="5y", interval="1d")["Close"]
        shares_outstanding = tk.info.get("sharesOutstanding", None)

        hist_pe = {}
        if shares_outstanding:
            for fiscal_date in inc.index:
                fiscal_date_str = fiscal_date.strftime("%Y-%m-%d")
                price = hist_prices[:fiscal_date_str].iloc[-1] if fiscal_date_str in hist_prices.index else None
                net_income = inc.at[fiscal_date, "Net Income"] if "Net Income" in inc.columns else None

                if price and net_income:
                    eps = net_income / shares_outstanding
                    pe = price / eps if eps != 0 else None
                    hist_pe[fiscal_date_str] = pe
        return hist_pe
    except Exception:
        return {}

def calculate_margins(inc):
    margins = {}
    try:
        for fiscal_date in inc.index:
            revenue = inc.at[fiscal_date, "Total Revenue"]
            gross_profit = inc.at[fiscal_date, "Gross Profit"]
            operating_income = inc.at[fiscal_date, "Operating Income"]
            net_income = inc.at[fiscal_date, "Net Income"]

            margins[fiscal_date.strftime("%Y-%m-%d")] = {
                "grossMargin": gross_profit / revenue if revenue else None,
                "operatingMargin": operating_income / revenue if revenue else None,
                "netMargin": net_income / revenue if revenue else None,
            }
    except Exception:
        pass
    return margins

def calculate_debt_to_equity(bal):
    debt_to_equity = {}
    try:
        for fiscal_date in bal.index:
            total_debt = bal.at[fiscal_date, "Total Debt"] if "Total Debt" in bal.columns else 0
            equity = bal.at[fiscal_date, "Total Stockholder Equity"] if "Total Stockholder Equity" in bal.columns else 0

            debt_to_equity[fiscal_date.strftime("%Y-%m-%d")] = (
                total_debt / equity if equity else None
            )
    except Exception:
        pass
    return debt_to_equity


def convert_fundamentals_to_JSON(raw_data: dict) -> dict:
    def clean_value(val):
        if isinstance(val, (np.float64, np.float32, np.int64, np.int32)):
            return float(val)
        if isinstance(val, (pd.Timestamp,)):
            return val.strftime("%Y-%m-%d")
        if isinstance(val, dict):
            return {clean_value(k): clean_value(v) for k, v in val.items()}
        return val

    return {k: clean_value(v) for k, v in raw_data.items()}

NEWS_LOOKBACK_DAYS = 30
NEWS_LIMIT_PER_TICKER = 15

def fetch_news(ticker:str) -> list[dict]:
    alpaca_api_key = os.getenv("ALPACA_API_KEY_ID")
    alpaca_api_secret = os.getenv("ALPACA_API_SECRET_KEY")

    if not alpaca_api_key or not alpaca_api_secret:
        raise RuntimeError(f"Alpaca API Keys missing in .env file at {env_path}")

    client = NewsClient(api_key=alpaca_api_key, secret_key=alpaca_api_secret)
    start_date = (pd.Timestamp.today() - pd.Timedelta(days=NEWS_LOOKBACK_DAYS)).strftime("%Y-%m-%d")

    req = NewsRequest(
        symbols=ticker,
        start=start_date,
        limit=NEWS_LIMIT_PER_TICKER
    )

    try:
        news_df = client.get_news(req).df
    except Exception as e:
        print(f"failed to fetch news for {ticker}: {e}")
        return []

    # Only keep the important fields
    articles = [
        {
            "headline": row["headline"],
            "summary": row["summary"],
            "url": row["url"]
        }
        for _, row in news_df.iterrows()
    ]

    return articles