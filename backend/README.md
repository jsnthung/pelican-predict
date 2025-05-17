# Backend Services

This directory contains the backend services for the Pelican Predict application.

## Setting Up Environment

You need to set up environment variables before running the application. Use the provided script:

```bash
cd controller
bash setup_env.sh
```

This script will prompt you for:
- MongoDB URI (default: mongodb://localhost:27017)
- Gemini API Key (get from https://makersuite.google.com/app/apikey)
- Alpaca API Keys (get from https://app.alpaca.markets/signup)

## Installing Dependencies

Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Running Stock Analysis

The stock analysis module is located in `controller/fundamental_analysis`. It uses Google's Gemini AI to analyze stock data and provide recommendations.

To run the stock analysis:

```bash
cd controller/fundamental_analysis
python main.py
```

This will:
1. Fetch financial data and news for the stocks listed in the script (AAPL, TSLA, NVDA)
2. Send the data to Gemini AI for analysis
3. Save both the raw data and the analysis results to MongoDB

## Testing the Gemini Implementation

You can test the Gemini API integration with:

```bash
cd controller/fundamental_analysis
python test_gemini.py
```

This tests the analysis with a small sample dataset.

## API Endpoints

The application provides several API endpoints for accessing stock data:

- `/stocks/financial-reports` - Gets the most recent financial report data
- `/stocks/fundamental-analysis` - Gets the most recent AI analysis of stock fundamentals

## MongoDB Collections

The application uses two main collections:
- `financial_reports` - Raw financial data and news
- `fundamental_analysis` - AI-generated analysis and recommendations
