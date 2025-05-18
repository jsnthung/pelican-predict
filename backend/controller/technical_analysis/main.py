from datetime import datetime, timedelta

from alpaca_client import create_alpaca_client, fetch_stock_data
from database import post_history, post_forecast
from stock_forecast import get_stock_forecast

def process_stock(symbol):
    """Process a single stock and return its forecast and history data"""
    alpaca_client = create_alpaca_client()

    stock_bars = fetch_stock_data(
        alpaca_client,
        symbol=symbol,
        start_date=(datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d"),
        end_date=(datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    )

    # Use the Gemini-based stock forecast implementation
    forecast_response = get_stock_forecast(stock_bars)
    
    # Convert to dict and add symbol information to each record
    history_data = stock_bars.reset_index().to_dict(orient="records")
    for record in history_data:
        record['symbol'] = symbol
    
    return forecast_response, history_data

def main(symbols=None):
    """
    Process multiple stock symbols and save their forecasts
    
    Args:
        symbols: List of stock symbols to process. Defaults to ["AAPL", "TSLA", "NVDA"]
    """
    if symbols is None:
        symbols = ["AAPL", "TSLA", "NVDA"]
    
    results = {}
    all_history_data = {}
    
    for symbol in symbols:
        print(f"Processing {symbol}...")
        try:
            forecast, history_data = process_stock(symbol)
            results[symbol] = forecast
            all_history_data[symbol] = history_data
            print(f"✅ Successfully processed {symbol}")
        except Exception as e:
            print(f"❌ Error processing {symbol}: {e}")
    
    # Save all forecasts to database
    post_forecast(results)
    print(f"✅ Saved forecasts for {', '.join(results.keys())}")
    
    # Save combined history data for all stocks
    if all_history_data:
        post_history(all_history_data)
        print(f"✅ Saved combined history data for {len(all_history_data)} data points across {len(results)} stocks")
    
    return results

if __name__ == "__main__":
    main()