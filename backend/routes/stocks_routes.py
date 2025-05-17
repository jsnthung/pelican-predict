from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any, Optional
from controller.mongodb import MongoDB

router = APIRouter()
mongodb = MongoDB(db_name="PeliCanStonks")

@router.get("/financial-reports", response_model=Optional[Dict[str, Any]])
async def get_financial_reports():
    """
    Get the most recent financial report from the database
    """
    try:
        mongodb.connect()
        # Fetch the latest document by sorting on timestamp in descending order
        # and limiting to 1 result
        collection = mongodb.get_collection("financial_reports")
        latest_report = collection.find().sort("timestamp", -1).limit(1)
        
        # Convert cursor to list and get the first (and only) item if it exists
        reports_list = list(latest_report)
        if not reports_list:
            return None
            
        report = reports_list[0]
        
        # Convert ObjectId to string for JSON serialization
        if "_id" in report:
            report["_id"] = str(report["_id"])
                
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching financial reports: {str(e)}")
    finally:
        mongodb.disconnect() 