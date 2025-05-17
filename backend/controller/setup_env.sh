#!/bin/bash

# Script to generate the .env file for the controller

ENV_FILE="./.env"  # Put it directly in the controller directory

echo "This script will help you set up your .env file with the necessary API keys."
echo "===================="

# Check if the .env file already exists
if [ -f "$ENV_FILE" ]; then
    read -p "A .env file already exists. Do you want to overwrite it? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Setup canceled."
        exit 0
    fi
fi

# Get MongoDB URI
read -p "MongoDB URI (press Enter for default 'mongodb://localhost:27017'): " mongo_uri
mongo_uri=${mongo_uri:-mongodb://localhost:27017}

# Get Gemini API key
read -p "Gemini API Key (get from https://makersuite.google.com/app/apikey): " gemini_key
if [ -z "$gemini_key" ]; then
    echo "Gemini API Key is required for AI analysis."
    exit 1
fi

# Get Alpaca API keys
read -p "Alpaca API Key ID (get from https://app.alpaca.markets/signup): " alpaca_key
if [ -z "$alpaca_key" ]; then
    echo "Alpaca API Key ID is required for fetching stock news."
    exit 1
fi

read -p "Alpaca API Secret Key: " alpaca_secret
if [ -z "$alpaca_secret" ]; then
    echo "Alpaca API Secret Key is required for fetching stock news."
    exit 1
fi

# Write to .env file
cat > "$ENV_FILE" << EOL
# Environment variables for the controller
MONGO_URI=$mongo_uri
GEMINI_API_KEY=$gemini_key
ALPACA_API_KEY_ID=$alpaca_key
ALPACA_API_SECRET_KEY=$alpaca_secret
EOL

echo "===================="
echo ".env file created successfully at $ENV_FILE"
echo "You can now run the stock analysis with: cd fundamental_analysis && python main.py" 