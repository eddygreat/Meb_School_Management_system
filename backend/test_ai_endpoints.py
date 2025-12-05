import os
import sys
from fastapi.testclient import TestClient
from app.main import app

# Add the current directory to sys.path to ensure imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

client = TestClient(app)

def test_chat():
    print("Testing /api/ai/chat endpoint...")
    payload = {
        "message": "Hello, how can you help me with my studies?",
        "context": "Student is in grade 10, studying mathematics."
    }
    try:
        response = client.post("/api/ai/chat", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_chat()
