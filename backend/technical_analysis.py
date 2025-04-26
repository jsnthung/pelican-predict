from alpaca.data import StockBarsRequest, TimeFrame
from alpaca.data.historical import StockHistoricalDataClient
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

stock_history = StockHistoricalDataClient(
    api_key=os.getenv("ALPACA_API_KEY_ID"),
    secret_key=os.getenv("ALPACA_API_SECRET_KEY"),
)

request_params = StockBarsRequest(
    symbol_or_symbols="AAPL",
    timeframe=TimeFrame.Day,
    start="2024-01-01",
    end="2025-01-01",
)

stock_bars = stock_history.get_stock_bars(request_params).df

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

schema = {
  "type": "object",
  "properties": {
    "weekly_forecast": {
      "type": "array",
      "description": "Predicted stock data for the next 7 days",
      "items": {
        "type": "object",
        "properties": {
          "day": {
            "type": "string",
            "description": "The day of the prediction (e.g., 2025-04-28)"
          },
          "open": {
            "type": "number",
            "description": "Predicted opening price"
          },
          "high": {
            "type": "number",
            "description": "Predicted highest price"
          },
          "low": {
            "type": "number",
            "description": "Predicted lowest price"
          },
          "close": {
            "type": "number",
            "description": "Predicted closing price"
          },
          "volume": {
            "type": "integer",
            "description": "Predicted trading volume (number of shares)"
          },
          "trade_count": {
            "type": "integer",
            "description": "Predicted number of trades"
          },
          "vwap": {
            "type": "number",
            "description": "Predicted Volume Weighted Average Price"
          }
        },
        "required": ["day", "open", "high", "low", "close", "volume", "trade_count", "vwap"]
      },
      "minItems": 7,
      "maxItems": 7
    },
    "recommendation": {
      "type": "string",
      "description": "Investment action recommendation",
      "enum": ["buy", "sell", "hold"]
    },
    "confidence_level": {
      "type": "integer",
      "description": "Confidence level in the recommendation (0-100)",
      "minimum": 0,
      "maximum": 100
    },
    "reasoning": {
      "type": "string",
      "description": "Explanation of the forecast and recommendation."
    },
    "detected_patterns": {
      "type": "array",
      "description": "Detected trading patterns from recent stock data",
      "items": {
        "type": "object",
        "properties": {
          "pattern_name": {
            "type": "string",
            "description": "Name of the pattern detected (e.g., Higher Highs, Double Top, Ascending Triangle)"
          },
          "supporting_points": {
            "type": "array",
            "description": "List of local highs/lows that support this pattern",
            "items": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["high", "low"],
                  "description": "Whether the point was a local high or local low"
                },
                "day": {
                  "type": "string",
                  "description": "The day the local high or low occurred (e.g., 2025-04-22)"
                },
                "price": {
                  "type": "number",
                  "description": "The price value at the local high or low"
                }
              },
              "required": ["type", "day", "price"]
            }
          }
        },
        "required": ["pattern_name", "supporting_points"]
      },
    }
  },
  "required": ["weekly_forecast", "recommendation", "confidence_level", "reasoning"]
}

prompt = f"""
You are a stock market expert.
Here is recent stock data:

{stock_bars.to_string(index=False)}

Based on this trend, predict the stock movement for the next 7 days.
Provide your prediction in the following JSON structure:

{schema}

**Important:** 
- Ensure all numbers have the correct type (float for prices, int for volume and trade_count).
- Give exactly 7 forecasted days.
- Only output valid JSON with no additional text outside the JSON.
"""

response = client.responses.create(
    model="o3",
    instructions="You are an expert financial analyst. Pay close attention to the data types; ensure the extracted values are of the correct type. Your output must conform exactly to the provided JSON schema.",
    input=prompt,
)

result_json = response.output

print(response.output_text)