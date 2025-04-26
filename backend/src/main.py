from data_loader import fetch_fundamentals, fetch_news, convert_fundamentals_to_JSON
from chatgpt_client import ask_chatgpt
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
    dataset = collect_dataset(TICKERS)

    # (optional) Save the raw dataset to a file
    with open("dataset.json", "w") as f:
        json.dump(dataset, f, indent=2)

    print("Sending data to ChatGPT for analysis...\n")
    result = ask_chatgpt(dataset)
    print(result)

if __name__ == "__main__":
    main()
