import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def create_openai_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_forecast_schema():
    return {
        "type": "object",
        "properties": {
            "weekly_forecast": {
                "type": "array",
                "description": "Predicted stock data for the next 30 days",
                "items": {
                    "type": "object",
                    "properties": {
                        "day": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                        "open": {"type": "number", "description": "Opening price"},
                        "high": {"type": "number", "description": "Highest price"},
                        "low": {"type": "number", "description": "Lowest price"},
                        "close": {"type": "number", "description": "Closing price"},
                        "volume": {"type": "integer", "description": "Volume of shares traded"},
                        "trade_count": {"type": "integer", "description": "Number of trades"},
                        "vwap": {"type": "number", "description": "Volume Weighted Average Price"}
                    },
                    "required": ["day", "open", "high", "low", "close", "volume", "trade_count", "vwap"]
                },
                "minItems": 30,
                "maxItems": 30
            },
            "recommendation": {
                "type": "string",
                "enum": ["buy", "sell", "hold"]
            },
            "confidence_level": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100
            },
            "reasoning": {"type": "string"},
            "detected_patterns": {
                "type": "array",
                "description": "Detected trading patterns from recent stock data. Only return value based on the data.",
                "items": {
                    "type": "object",
                    "properties": {
                        "pattern_name": {"type": "string"},
                        "supporting_points": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "type": {"type": "string", "enum": ["high", "low"]},
                                    "day": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                                    "high": {"type": "number", "description": "High price"},
                                    "low": {"type": "number", "description": "Low price"},
                                },
                                "required": ["type", "day", "high", "low"]
                            }
                        }
                    },
                    "required": ["pattern_name", "supporting_points"]
                }
            }
        },
        "required": ["weekly_forecast", "recommendation", "confidence_level", "reasoning", "detected_patterns"]
    }

# Create prompt for OpenAI
def create_prompt(stock_bars, schema):
    return f"""
You are a stock market expert.
Here is recent stock data:

{stock_bars.to_string(index=False)}

Based on this trend, predict the stock movement for the next 30 days and also provide a reasoning and trading patterns (the beginning and end date of the detected pattern) that supports your prediction.
Provide your prediction and the reasons in the following JSON structure:

{json.dumps(schema, indent=2)}

**Important:** 
- Ensure all numbers have the correct type (float for prices, int for volume and trade_count).
- Give exactly 30 forecasted days.
- Only output valid JSON with no additional text outside the JSON.
"""

def get_stock_forecast(openai_client, prompt):
    response = openai_client.chat.completions.create(
        model="o3",
        messages=[
            {"role": "system", "content": "You are an expert financial analyst. Pay close attention to the data types; ensure the extracted values are of the correct type. Your output must conform exactly to the provided JSON schema."},
            {"role": "user", "content": prompt}
        ],
        tools=[{
            "type": "function",
            "function": {
                "name": "generate_stock_forecast",
                "description": "Predict stock data for the next 30 days based on historical trends, provide a recommendation (buy/sell/hold) and confidence level, and detect any trading patterns.",
                "parameters": get_forecast_schema()
            }
        }],
        tool_choice="auto",
    )

    tool_calls = response.choices[0].message.tool_calls

    if not tool_calls:
        raise ValueError("No tool calls found in OpenAI response.")

    function_args = tool_calls[0].function.arguments

    if isinstance(function_args, str):
        parsed_args = json.loads(function_args)
    else:
        parsed_args = function_args

    return parsed_args