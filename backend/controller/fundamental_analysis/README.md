# Fundamental Analysis Module

This module handles the fundamental analysis of stock data using Google's Gemini AI.

## Transition from ChatGPT to Gemini

This module previously used OpenAI's ChatGPT for stock analysis, but has been transitioned to Google's Gemini for the following reasons:

1. More cost-effective API usage
2. Similar capabilities for structured analysis
3. No longer dependent on OpenAI API keys

## Setup

1. Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add your API key to the `.env` file in the parent directory:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

The main workflow is handled in `main.py`:
- Retrieves stock data (fundamentals and news) for a list of tickers
- Sends the data to Gemini for analysis
- Saves both the raw data and the analysis results to MongoDB

## Testing

You can test the Gemini integration by running:
```
python test_gemini.py
```

This will process a small sample dataset and display the results.

## Components

- `gemini_client.py`: Handles communication with Google's Gemini API
- `data_loader.py`: Fetches financial data and news for stocks
- `system_prompt.py`: Contains the system prompt used to guide Gemini's analysis
- `mongo_client.py`: Manages MongoDB connections and storage

## Output Structure

The analysis from Gemini is structured as:
```json
{
  "recommendations": [
    {
      "ticker": "TICKER_SYMBOL",
      "recommendation": "BUY/WAIT/AVOID",
      "confidence": "High/Medium/Low",
      "pro": "One key strength...",
      "con": "One key concern...",
      "summary": "Overall assessment..."
    },
    ...
  ]
}
```

This matches the schema previously used with ChatGPT for seamless transition. 