import os
import json
import time
import google.api_core.exceptions
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

# Load .env
env_path = Path(__file__).parent.parent.parent / '.env'
print(f"Looking for .env file at: {env_path}")
load_dotenv(dotenv_path=env_path)

def get_forecast_schema():
    return {
        "weekly_forecast": [
            {
                "day": "YYYY-MM-DD",
                "open": 0.0,
                "high": 0.0,
                "low": 0.0,
                "close": 0.0,
                "volume": 0,
                "trade_count": 0,
                "vwap": 0.0
            }
        ],
        "recommendation": "buy/sell/hold",
        "confidence_level": 0,
        "reasoning": "Explanation for the recommendation",
        "detected_patterns": [
            {
                "pattern_name": "Name of the pattern",
                "supporting_points": [
                    {
                        "type": "high/low",
                        "day": "YYYY-MM-DD",
                        "high": 0.0,
                        "low": 0.0
                    }
                ]
            }
        ]
    }

def create_prompt(stock_bars):
    schema = get_forecast_schema()
    
    return f"""
You are a stock market expert.
Here is recent stock data:

{stock_bars.to_string(index=False)}

Based on this trend, predict the stock movement for the next 30 days and also provide a reasoning and trading patterns (the beginning and end date of the detected pattern) that supports your prediction.
Provide your prediction and the reasons in the following JSON structure:

{json.dumps(schema, indent=2)}

**CRITICAL REQUIREMENTS:** 
- Your response MUST include EXACTLY 30 days in the weekly_forecast array - no more, no less.
- Ensure all numbers have the correct type (float for prices, int for volume and trade_count).
- Only output valid JSON with no additional text outside the JSON.
- Your response should start from the next trading day after the last day in the provided data.
"""

def get_stock_forecast(stock_bars, max_retries=3, use_fallback_model=True):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(f"Gemini API key missing in .env file at {env_path}")

    # Configure the Gemini API
    genai.configure(api_key=api_key)
    
    # Create the prompt
    prompt = create_prompt(stock_bars)

    # Try with the powerful model first, then fall back to a simpler model if needed
    models_to_try = ['gemini-1.5-flash']
    
    # Add fallback model if option is enabled
    if use_fallback_model:
        models_to_try.append('gemini-1.5-flash')  # Fallback to a model with higher quota limits
    
    last_exception = None
    
    for model_name in models_to_try:
        retries = 0
        while retries < max_retries:
            try:
                print(f"Attempting to use model: {model_name}")
                model = genai.GenerativeModel(model_name)
                
                # Set the generation config to emphasize structured output
                generation_config = {
                    "temperature": 0.2,  # Lower temperature for more deterministic output
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 8192,
                }
                
                response = model.generate_content(
                    prompt,
                    generation_config=generation_config
                )
                
                # Try to extract structured JSON from the response
                response_text = response.text
                
                # Find JSON content between triple backticks if present
                if "```json" in response_text and "```" in response_text:
                    json_content = response_text.split("```json")[1].split("```")[0]
                elif "```" in response_text:
                    json_content = response_text.split("```")[1].split("```")[0]
                else:
                    json_content = response_text
                    
                parsed_json = json.loads(json_content)
                
                # Validate the response structure
                required_keys = ["weekly_forecast", "recommendation", "confidence_level", "reasoning", "detected_patterns"]
                for key in required_keys:
                    if key not in parsed_json:
                        raise ValueError(f"Missing '{key}' key in response")
                
                # Ensure we have exactly 30 forecasted days
                forecast_days = len(parsed_json["weekly_forecast"])
      
                print(f"Successfully generated forecast with {forecast_days} days")
                return parsed_json
                
            except google.api_core.exceptions.ResourceExhausted as e:
                last_exception = e
                retry_delay = 10  # Default retry delay in seconds
                
                # Try to extract retry delay from error message if available
                if hasattr(e, 'retry_delay') and hasattr(e.retry_delay, 'seconds'):
                    retry_delay = e.retry_delay.seconds
                
                print(f"Rate limit exceeded. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retries += 1
                
            except (json.JSONDecodeError, ValueError) as e:
                last_exception = e
                print(f"Error with model {model_name}: {e}")
                # Don't retry for JSON parsing errors, try another model
                break
                
            except Exception as e:
                last_exception = e
                print(f"Unexpected error with model {model_name}: {e}")
                retries += 1
                time.sleep(5)  # Wait 5 seconds before retrying
    
    # If we've exhausted all models and retries
    raise RuntimeError(f"Failed to get valid response from Gemini API after multiple attempts: {last_exception}")