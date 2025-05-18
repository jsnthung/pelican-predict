import os
from dotenv import load_dotenv
from pathlib import Path

# Try to load the .env file from the backend directory
env_path = Path(__file__).parent.parent / '.env'  # This will check /backend/.env
print(f"Checking for .env file at: {env_path}")
print(f"File exists: {env_path.exists()}")

if env_path.exists():
    print(f"File permissions: {oct(os.stat(env_path).st_mode)[-3:]}")
    print(f"File size: {env_path.stat().st_size} bytes")

load_dotenv(dotenv_path=env_path)

# Check if environment variables are loaded
mongo_uri = os.getenv("MONGO_URI")
gemini_key = os.getenv("GEMINI_API_KEY")
alpaca_key = os.getenv("ALPACA_API_KEY_ID")
alpaca_secret = os.getenv("ALPACA_API_SECRET_KEY")

print("\nEnvironment Variables:")
print(f"MONGO_URI: {'SET' if mongo_uri else 'NOT SET'}")
print(f"GEMINI_API_KEY: {'SET' if gemini_key else 'NOT SET'}")
print(f"ALPACA_API_KEY_ID: {'SET' if alpaca_key else 'NOT SET'}")
print(f"ALPACA_API_SECRET_KEY: {'SET' if alpaca_secret else 'NOT SET'}")

# If any environment variable is missing, print helpful message
if not all([mongo_uri, gemini_key, alpaca_key, alpaca_secret]):
    print("\nSome environment variables are missing. Make sure your .env file contains all required variables:")
    print("MONGO_URI=mongodb://localhost:27017")
    print("GEMINI_API_KEY=your_gemini_api_key")
    print("ALPACA_API_KEY_ID=your_alpaca_key")
    print("ALPACA_API_SECRET_KEY=your_alpaca_secret") 