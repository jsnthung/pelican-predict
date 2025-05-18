from datetime import datetime

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env
env_path = Path(__file__).parent.parent.parent / '.env'
print(f"Looking for .env file at: {env_path}")
load_dotenv(dotenv_path=env_path)

uri = os.getenv("MONGO_URI")
if not uri:
    raise RuntimeError(f"MONGO_URI not set in .env file at {env_path}!")

client = MongoClient(uri, server_api=ServerApi('1'))

db = client["PeliCanStonks"]
collection_forecast = db["technical_analysis"]
collection_history = db["stonk_history"]

def post_forecast(forecast_data):
    """
    Save forecast data to MongoDB
    
    Args:
        forecast_data: Either a dictionary containing a single stock forecast,
                      or a dictionary mapping stock symbols to their forecasts
    """
    # Check if we're dealing with multiple stocks or a single stock
    if isinstance(forecast_data, dict) and any(key in ['weekly_forecast', 'recommendation'] for key in forecast_data):
        # Single stock forecast
        document = {
            'timestamp': datetime.now(),
            'forecast': forecast_data
        }
    else:
        # Multiple stock forecasts
        document = {
            'timestamp': datetime.now(),
            'stocks': forecast_data
        }
    
    insert_result = collection_forecast.insert_one(document)
    print(f"Inserted forecast with ID: {insert_result.inserted_id}")
    return insert_result.inserted_id


def post_history(history_data, symbol=None):
    """
    Save historical stock data to MongoDB
    
    Args:
        history_data: Either a dictionary mapping symbols to their history data,
                     or a list of history data points for a single symbol
        symbol: Stock symbol (optional, used for labeling the data if not already included)
    """
    document = {
        'timestamp': datetime.now()
    }
    
    # Check if we're dealing with a dictionary of symbols to data
    if isinstance(history_data, dict) and all(isinstance(v, list) for v in history_data.values()):
        # This is a dictionary of symbols to history data
        document['stocks'] = history_data
    else:
        # This is a list of history data for a single symbol
        if symbol and isinstance(history_data, list) and len(history_data) > 0 and 'symbol' not in history_data[0]:
            for record in history_data:
                record['symbol'] = symbol
        
        document['data'] = history_data
    
    insert_result = collection_history.insert_one(document)
    print(f"Inserted history with ID: {insert_result.inserted_id}")
    return insert_result.inserted_id