import os
import json
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from tabulate import tabulate
from bson import json_util

# Load .env
env_path = Path(__file__).parent.parent.parent / '.env'
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

def get_latest_analysis():
    """Get the most recent analysis from the database"""
    latest = analysis_collection.find().sort("timestamp", -1).limit(1)
    
    for doc in latest:
        # Convert MongoDB document to JSON string and then back to Python dict
        # This handles BSON types like ObjectId and datetime
        return json.loads(json_util.dumps(doc))
    
    return None

def display_analysis_summary(analysis):
    """Display a nice summary of the analysis"""
    if not analysis:
        print("No analysis found in the database.")
        return
    
    timestamp = datetime.fromisoformat(analysis["timestamp"]["$date"][:-1])  # Remove 'Z' at the end
    
    print(f"\n=== STOCK ANALYSIS SUMMARY (Generated: {timestamp.strftime('%Y-%m-%d %H:%M:%S')}) ===\n")
    
    # Prepare data for tabulate
    rows = []
    for ticker, data in analysis["stocks"].items():
        recommendation = data["recommendation"]
        confidence = data["confidence"]
        recommendation_colored = f"\033[1;32m{recommendation}\033[0m" if recommendation == "BUY" else \
                                 f"\033[1;33m{recommendation}\033[0m" if recommendation == "WAIT" else \
                                 f"\033[1;31m{recommendation}\033[0m"
        
        row = [
            ticker,
            recommendation_colored,
            confidence,
            data["pro"],
            data["con"]
        ]
        rows.append(row)
    
    # Print table
    headers = ["Ticker", "Recommendation", "Confidence", "Key Strength", "Key Concern"]
    print(tabulate(rows, headers=headers, tablefmt="grid"))
    
    # Print detailed summaries
    print("\n=== DETAILED ANALYSIS ===\n")
    for ticker, data in analysis["stocks"].items():
        print(f"📊 \033[1;36m{ticker}\033[0m - {data['recommendation']} ({data['confidence']} confidence)")
        print(f"Summary: {data['summary']}")
        print()

def main():
    analysis = get_latest_analysis()
    display_analysis_summary(analysis)
    
    print("\n=== RAW JSON DATA ===\n")
    print(json.dumps(analysis, indent=2))

if __name__ == "__main__":
    main() 