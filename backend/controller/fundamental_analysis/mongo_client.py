import os
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load .env
env_path = Path(__file__).parent.parent.parent / '.env'  # Changed to go up two directories to reach /backend
print(f"Looking for .env file at: {env_path}")
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError(f"MONGO_URI not set in .env file at {env_path}!")

client = MongoClient(
    MONGO_URI,
    tlsAllowInvalidCertificates=True
)
db = client["PeliCanStonks"]
analysis_collection = db["fundamental_analysis"]
reports_collection = db["financial_reports"]

def test_mongo_connection():
    try:
        client.admin.command('ping')
        print("✅ MongoDB connection successful (ping passed).")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)

def save_to_mongo(dataset: dict, result: dict):
    timestamp_now = datetime.now()

    # --- Prepare financial_reports document ---
    financial_stocks = {}
    for ticker, data in dataset.items():
        financial_stocks[ticker] = {
            "fundamentals": data["fundamentals"],
            "news": data["news"]
        }

    reports_document = {
        "timestamp": timestamp_now,
        "stocks": financial_stocks
    }
    reports_collection.insert_one(reports_document)
    print("✅ Saved raw dataset to 'financial_reports' collection.")

    # --- Prepare fundamental_analysis document ---
    analysis_stocks = {}
    for item in result["recommendations"]:
        ticker = item["ticker"]
        analysis_stocks[ticker] = {
            "recommendation": item["recommendation"],
            "confidence": item["confidence"],
            "pro": item["pro"],
            "con": item["con"],
            "summary": item["summary"]
        }

    analysis_document = {
        "timestamp": timestamp_now,
        "stocks": analysis_stocks
    }
    analysis_collection.insert_one(analysis_document)
    print("✅ Saved structured analysis to 'fundamental_analysis' collection.")

