import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.main import app
    print("Successfully imported app.main")
except Exception as e:
    import traceback
    traceback.print_exc()
