import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("No API Key found")
    exit(1)

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

print(f"Testing connection to {url.split('?')[0]}...")

try:
    response = requests.get(url, timeout=10)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success! Models found:")
        data = response.json()
        for m in data.get('models', [])[:3]:
            print(f"- {m['name']}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
