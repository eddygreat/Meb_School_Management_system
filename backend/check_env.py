import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
if key:
    print(f"GEMINI_API_KEY is set (length: {len(key)})")
else:
    print("GEMINI_API_KEY is NOT set")

db_url = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {db_url}")
