from data_loader import fetch_news
import json

if __name__ == "__main__":
    ticker = "AAPL"
    news_articles = fetch_news(ticker)

    print(json.dumps(news_articles, indent=2))