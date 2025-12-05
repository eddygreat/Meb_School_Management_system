import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

print("Importing ai_service...")
try:
    from app.services import ai_service
    print("Successfully imported ai_service")
except Exception as e:
    print(f"Failed to import ai_service: {e}")
