import os
import sys
from app.services.ai_service import chat_with_student

# Add the current directory to sys.path to ensure imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_chat_service():
    print("Testing chat_with_student service function...")
    message = "Hello, how can you help me with my studies?"
    context = "Student is in grade 10, studying mathematics."
    
    try:
        response = chat_with_student(message, context)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_chat_service()
