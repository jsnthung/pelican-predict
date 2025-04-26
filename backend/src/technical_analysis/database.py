from datetime import datetime

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("MONGO_URI"),
client = MongoClient(uri, server_api=ServerApi('1'))

db = client["PeliCanStonks"]
collection_forecast = db["technical_analysis"]
collection_history = db["stonk_history"]

def post_forecast(forecast_response:dict):
    document = {
        'timestamp': datetime.now(),
        'forecast': forecast_response
    }
    insert_result = collection_forecast.insert_one(document)
    print(f"Inserted forecast with ID: {insert_result.inserted_id}")


def post_history(forecast_history:dict):
    document = {
        'timestamp': datetime.now(),
        'forecast': forecast_history
    }
    insert_result = collection_history.insert_one(document)
    print(f"Inserted history with ID: {insert_result.inserted_id}")