from data_loader import fetch_fundamentals, convert_fundamentals_to_JSON
import json

if __name__ == "__main__":
    ticker = "AAPL"
    data = fetch_fundamentals(ticker)
    clean_data = convert_fundamentals_to_JSON(data)
    print(json.dumps(clean_data, indent=2))

