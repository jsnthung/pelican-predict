from datetime import datetime, timedelta

from alpaca_client import create_alpaca_client, fetch_stock_data
from backend.src.technical_analysis.database import post_history
from stock_forecast import create_openai_client, get_stock_forecast, get_forecast_schema, create_prompt
from database import post_forecast

def main():
    alpaca_client = create_alpaca_client()
    openai_client = create_openai_client()

    stock_bars = fetch_stock_data(
        alpaca_client,
        symbol="AAPL",
        start_date=(datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d"),
        end_date=datetime.now().strftime("%Y-%m-%d")
    )

    schema = get_forecast_schema()
    prompt = create_prompt(stock_bars, schema)

    forecast_response = get_stock_forecast(openai_client, prompt)
    post_forecast(forecast_response)
    post_history(stock_bars.reset_index().to_dict(orient="records"))


if __name__ == "__main__":
    main()