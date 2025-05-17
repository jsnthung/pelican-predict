from data_loader import fetch_fundamentals, fetch_news, convert_fundamentals_to_JSON
from gemini_client import ask_gemini
from mongo_client import save_to_mongo, test_mongo_connection
import json

TICKERS = ["AAPL", "TSLA", "NVDA"]

def collect_dataset(tickers):
    bundle = {}
    for tkr in tickers:
        print(f"Collecting data for {tkr}...")
        fundamentals = fetch_fundamentals(tkr)
        news = fetch_news(tkr)
        clean_fundamentals = convert_fundamentals_to_JSON(fundamentals)
        bundle[tkr] = {
            "fundamentals": clean_fundamentals,
            "news": news
        }
    return bundle

def main():
    # test_mongo_connection()
    dataset = collect_dataset(TICKERS)

    # Save the raw dataset to a file
    with open("dataset.json", "w") as f:
        json.dump(dataset, f, indent=2)

    print("Sending data to Gemini for analysis...\n")
    result = ask_gemini(dataset)

    print(json.dumps(result, indent=2))

    save_to_mongo(dataset, result)


if __name__ == "__main__":
    main()
