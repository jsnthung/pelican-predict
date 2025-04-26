import os
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load .env
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in .env!")

client = MongoClient(
    MONGO_URI,
    tlsAllowInvalidCertificates=True
)
db = client["PeliCanStonks"]
collection = db["fundamental_analysis"]

def test_mongo_connection():
    try:
        client.admin.command('ping')
        print("✅ MongoDB connection successful (ping passed).")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)

def save_to_mongo(result: dict):
    collection.create_index("timestamp")
    stocks = {}
    for item in result["recommendations"]:
        ticker = item["ticker"]
        stocks[ticker] = {
            "recommendation": item["recommendation"],
            "confidence": item["confidence"],
            "pro": item["pro"],
            "con": item["con"],
            "summary": item["summary"],
        }

    document = {
        "timestamp": datetime.now(),
        "stocks": stocks
    }

    collection.insert_one(document)
    print("✅ Successfully saved structured result to MongoDB.")
