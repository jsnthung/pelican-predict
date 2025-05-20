import time
import requests

def main(args=None):
    endpoint = "https://pelican-predict-backend.onrender.com"

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }

    data = ["AAPL", "TSLA", "NVDA"]

    response1 = requests.post(endpoint + '/stocks/technical-analysis/generate',headers=headers, json=data)
    
    delay = 5
    while delay > 0:
        print(f"Waiting for {delay} seconds...")
        time.sleep(1)
        delay -= 1
    
    response2 = requests.post(endpoint + '/stocks/fundamental-analysis/generate',headers=headers, json=data)

    print(response1.text)
    print(response2.text)
    
    return "success"

if __name__ == "__main__":
    main()