import requests
import json

def test_endpoint():
    url = "http://localhost:8000/api/ai/chat"
    payload = {
        "message": "Hello",
        "context": "test"
    }
    try:
        print(f"Sending POST to {url}...")
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print("Response Body:")
        print(response.text)
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_endpoint()
