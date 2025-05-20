import os
import json
import time
import google.api_core.exceptions
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

from controller.fundamental_analysis.system_prompt import SYSTEM_PROMPT

# Load .env
env_path = Path(__file__).parent.parent.parent / '.env'  # Changed to go up two directories to reach /backend
print(f"Looking for .env file at: {env_path}")
load_dotenv(dotenv_path=env_path)

def ask_gemini(data: dict, max_retries=3, use_fallback_model=True) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(f"Gemini API key missing in .env file at {env_path}")

    # Configure the Gemini API
    genai.configure(api_key=api_key)

    # Create a structured prompt that includes both the system prompt and the data
    structured_prompt = f"""
{SYSTEM_PROMPT}

Analyze the following JSON data for each stock individually:

{json.dumps(data, indent=2)}

Remember to return your analysis in the following JSON structure:
{{
  "recommendations": [
    {{
      "ticker": "TICKER_SYMBOL",
      "recommendation": "BUY/WAIT/AVOID",
      "confidence": "High/Medium/Low",
      "pro": "One key strength...",
      "con": "One key concern...",
      "summary": "Overall assessment that considers both pro and con..."
    }},
    ...
  ]
}}
"""

    # Try with the powerful model first, then fall back to a simpler model if needed
    models_to_try = ['gemini-1.5-pro']
    
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
                response = model.generate_content(structured_prompt)
                
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
                if "recommendations" not in parsed_json:
                    raise ValueError("Missing 'recommendations' key in response")
                    
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