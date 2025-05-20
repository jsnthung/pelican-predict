import requests

def main(args=None):
    endpoint = "https://pelican-predict-backend.onrender.com"

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }

    data = ["AAPL", "TSLA", "NVDA"]

    response = requests.post(endpoint + '/stocks/technical-analysis/generate',headers=headers, json=data)

    print(response.text)
    return "success"

if __name__ == "__main__":
    main()