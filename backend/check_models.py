import google.generativeai as genai
import os
import sys
import time

print(f"Python version: {sys.version}", flush=True)
print(f"GenAI version: {genai.__version__}", flush=True)
from dotenv import load_dotenv

print("Loading dotenv...", flush=True)
load_dotenv()
print("Dotenv loaded.", flush=True)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found.", flush=True)
else:
    print(f"API Key found: {api_key[:5]}...", flush=True)
    genai.configure(api_key=api_key, transport='rest')
    print("Listing available models...", flush=True)
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"Found model: {m.name}", flush=True)
    except Exception as e:
        print(f"Error listing models: {e}", flush=True)
