import os
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional, Dict, List, Any

class MongoDB:
    def __init__(self, db_name: str = "PeliCanStonks"):
        # Load .env
        env_path = Path(__file__).parent.parent / '.env'
        load_dotenv(dotenv_path=env_path)
        
        self.mongo_uri = os.getenv("MONGO_URI")
        if not self.mongo_uri:
            raise RuntimeError("MONGO_URI not set in .env!")
        
        self.client = None
        self.db_name = db_name
        self.db = None
    
    def connect(self) -> None:
        """Connect to MongoDB"""
        if not self.client:
            self.client = MongoClient(
                self.mongo_uri,
                tls=True
            )
            self.db = self.client[self.db_name]
            # Test connection
            try:
                self.client.admin.command('ping')
                print(f"✅ MongoDB connection successful (ping passed). Connected to {self.db_name}.")
            except Exception as e:
                print(f"❌ MongoDB connection failed: {e}")
                raise
    
    def disconnect(self) -> None:
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            print("MongoDB connection closed.")
    
    def get_collection(self, collection_name: str):
        """Get a collection object"""
        if not self.client:
            self.connect()
        return self.db[collection_name]
    
    def fetch_data(self, collection_name: str, query: Dict = None, projection: Dict = None) -> List[Dict[str, Any]]:
        """Fetch documents from a collection based on query"""
        collection = self.get_collection(collection_name)
        if query is None:
            query = {}
        if projection is None:
            return list(collection.find(query))
        else:
            return list(collection.find(query, projection))
    
    def fetch_one(self, collection_name: str, query: Dict = None) -> Optional[Dict[str, Any]]:
        """Fetch a single document from a collection based on query"""
        collection = self.get_collection(collection_name)
        if query is None:
            query = {}
        return collection.find_one(query)
    
    def insert_one(self, collection_name: str, document: Dict) -> str:
        """Insert a document into a collection"""
        collection = self.get_collection(collection_name)
        result = collection.insert_one(document)
        return str(result.inserted_id)
    
    def insert_many(self, collection_name: str, documents: List[Dict]) -> List[str]:
        """Insert multiple documents into a collection"""
        collection = self.get_collection(collection_name)
        result = collection.insert_many(documents)
        return [str(id) for id in result.inserted_ids]
    
    def update_one(self, collection_name: str, query: Dict, update: Dict, upsert: bool = False) -> int:
        """Update a document in a collection"""
        collection = self.get_collection(collection_name)
        result = collection.update_one(query, update, upsert=upsert)
        return result.modified_count
    
    def delete_one(self, collection_name: str, query: Dict) -> int:
        """Delete a document from a collection"""
        collection = self.get_collection(collection_name)
        result = collection.delete_one(query)
        return result.deleted_count


# Example usage
if __name__ == "__main__":
    # Initialize MongoDB connection
    mongodb = MongoDB(db_name="PeliCanStonks")
    
    try:
        # Connect to the database
        mongodb.connect()
        
        # Example: Fetch the most recent stock analysis
        latest_analysis = mongodb.fetch_one(
            collection_name="fundamental_analysis",
            query={},
        )
        
        if latest_analysis:
            print(f"Latest analysis timestamp: {latest_analysis.get('timestamp')}")
            print(f"Stocks analyzed: {len(latest_analysis.get('stocks', {}))}")
        else:
            print("No analysis found")
            
        # Example: Insert a test document
        test_doc = {
            "timestamp": datetime.now(),
            "type": "test",
            "data": {"message": "This is a test document"}
        }
        # mongodb.insert_one("test_collection", test_doc)
        
    finally:
        # Always disconnect when done
        mongodb.disconnect() 