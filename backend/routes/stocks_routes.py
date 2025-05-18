from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, List, Any, Optional
from controller.mongodb import MongoDB
import sys
import os
import importlib.util
from pathlib import Path

router = APIRouter()
mongodb = MongoDB(db_name="PeliCanStonks")

# Import the technical analysis functions
def load_technical_analysis():
    try:
        # Get the base path for the controller directory
        base_path = Path(__file__).parent.parent / "controller"
        
        # Add the technical_analysis directory to sys.path
        tech_analysis_path = str(base_path / "technical_analysis")
        if tech_analysis_path not in sys.path:
            sys.path.append(tech_analysis_path)
            
        # Import the main module from technical_analysis
        spec = importlib.util.spec_from_file_location(
            "tech_analysis", 
            base_path / "technical_analysis" / "main.py"
        )
        tech_analysis = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(tech_analysis)
        
        return tech_analysis.main
    except Exception as e:
        print(f"Error loading technical analysis module: {e}")
        return None

# Load the technical analysis functions
run_technical_analysis = load_technical_analysis()

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

@router.get("/fundamental-analysis", response_model=Optional[Dict[str, Any]])
async def get_fundamental_analysis():
    """
    Get the most recent fundamental analysis from the database
    """
    try:
        mongodb.connect()
        # Fetch the latest document by sorting on timestamp in descending order
        # and limiting to 1 result
        collection = mongodb.get_collection("fundamental_analysis")
        latest_analysis = collection.find().sort("timestamp", -1).limit(1)
        
        # Convert cursor to list and get the first (and only) item if it exists
        analysis_list = list(latest_analysis)
        if not analysis_list:
            return None
            
        analysis = analysis_list[0]
        
        # Convert ObjectId to string for JSON serialization
        if "_id" in analysis:
            analysis["_id"] = str(analysis["_id"])
                
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching fundamental analysis: {str(e)}")
    finally:
        mongodb.disconnect()

@router.get("/technical-analysis", response_model=Optional[Dict[str, Any]])
async def get_technical_analysis():
    """
    Get the most recent technical analysis from the database
    """
    try:
        mongodb.connect()
        # Fetch the latest document by sorting on timestamp in descending order
        # and limiting to 1 result
        collection = mongodb.get_collection("technical_analysis")
        latest_analysis = collection.find().sort("timestamp", -1).limit(1)
        
        # Convert cursor to list and get the first (and only) item if it exists
        analysis_list = list(latest_analysis)
        if not analysis_list:
            return None
            
        analysis = analysis_list[0]
        
        # Convert ObjectId to string for JSON serialization
        if "_id" in analysis:
            analysis["_id"] = str(analysis["_id"])
                
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching technical analysis: {str(e)}")
    finally:
        mongodb.disconnect()

@router.post("/technical-analysis/generate", response_model=Dict[str, Any])
async def generate_technical_analysis(background_tasks: BackgroundTasks, symbols: Optional[List[str]] = None):
    """
    Generate a new technical analysis for the specified stock symbols
    
    Args:
        symbols: List of stock symbols to analyze. Defaults to ["AAPL", "TSLA", "NVDA"]
    """
    if not run_technical_analysis:
        raise HTTPException(status_code=500, detail="Technical analysis module not available")
        
    if not symbols:
        symbols = ["AAPL", "TSLA", "NVDA"]
        
    # Run the analysis in the background
    background_tasks.add_task(run_technical_analysis, symbols)
    
    return {
        "message": f"Technical analysis started for symbols: {', '.join(symbols)}",
        "status": "processing"
    }

@router.get("/stock-history", response_model=Optional[Dict[str, Any]])
async def get_stock_history(symbol: Optional[str] = None):
    """
    Get the most recent historical stock data
    
    Args:
        symbol: Optional stock symbol to filter results
    """
    try:
        mongodb.connect()
        collection = mongodb.get_collection("stonk_history")
        latest_history = collection.find().sort("timestamp", -1).limit(1)
        history_list = list(latest_history)
        if not history_list:
            return None
        history = history_list[0]
        # Convert ObjectId to string for JSON serialization
        if "_id" in history:
            history["_id"] = str(history["_id"])
        # Handle new structure: data is a dict of symbols
        if "data" in history and isinstance(history["data"], dict):
            if symbol:
                # Return only the requested symbol's array
                symbol_data = history["data"].get(symbol, [])
                return {
                    "_id": history["_id"],
                    "timestamp": history["timestamp"],
                    "data": {symbol: symbol_data}
                }
            else:
                # Return all symbols
                return history
        # Handle old structure: data is a list
        elif "data" in history and isinstance(history["data"], list):
            if symbol:
                filtered = [item for item in history["data"] if item.get("symbol") == symbol]
                return {
                    "_id": history["_id"],
                    "timestamp": history["timestamp"],
                    "data": filtered
                }
            else:
                return history
        # Handle previous structure: stocks dict
        elif "stocks" in history and isinstance(history["stocks"], dict):
            if symbol:
                return {
                    "_id": history["_id"],
                    "timestamp": history["timestamp"],
                    "stocks": {symbol: history["stocks"].get(symbol, [])}
                }
            else:
                return history
        else:
            # Unknown structure, return as is
            return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock history: {str(e)}")
    finally:
        mongodb.disconnect() 