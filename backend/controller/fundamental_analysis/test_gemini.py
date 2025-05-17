import json
from gemini_client import ask_gemini

def test_gemini_with_sample_data():
    # Load a small sample dataset for testing
    sample_data = {
        "AAPL": {
            "fundamentals": {
                "income": {
                    "Total Revenue": {
                        "2024-09-30": 391035000000,
                        "2023-09-30": 383285000000,
                        "2022-09-30": 394328000000
                    },
                    "Net Income": {
                        "2024-09-30": 93736000000,
                        "2023-09-30": 96995000000,
                        "2022-09-30": 99803000000
                    }
                },
                "trailingPE": 33.219048,
                "currentPBV": 47.156376,
                "margins": {
                    "2024-09-30": {
                        "grossMargin": 0.462,
                        "operatingMargin": 0.315,
                        "netMargin": 0.239
                    }
                }
            },
            "news": [
                {
                    "headline": "Apple Plans iPhone Shift From China To India",
                    "summary": "Apple plans to pivot iPhone production from China to India",
                    "url": "https://example.com/news1"
                }
            ]
        }
    }
    
    try:
        print("Sending sample data to Gemini for analysis...")
        result = ask_gemini(sample_data)
        print("\nGemini analysis result:")
        print(json.dumps(result, indent=2))
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_gemini_with_sample_data() 