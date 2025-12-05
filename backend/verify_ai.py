import asyncio
import os
from app.services.ai_service import verify_face, grade_assignment, generate_study_guide, predict_performance, generate_lesson_plan

# Mock data for testing
mock_image_bytes = b"fake_image_data"
mock_question = "What is the capital of France?"
mock_answer = "Paris"
mock_student_data = "Math: 60%, Science: 85%, History: 90%"
mock_history = "Grades: [80, 82, 75, 60]. Attendance: 95%."

async def test_ai_functions():
    print("--- Testing AI Functions ---")
    
    # Note: These will fail without a valid GEMINI_API_KEY in .env
    if not os.getenv("GEMINI_API_KEY"):
        print("WARNING: GEMINI_API_KEY not found in environment variables. Tests will likely fail or return error messages.")

    print("\n1. Testing Face Verification (Mocked Images)...")
    try:
        # This is expected to fail or return False with fake bytes if API is active
        match = verify_face(mock_image_bytes, mock_image_bytes)
        print(f"Result: {match}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n2. Testing Grading...")
    try:
        grade = grade_assignment(mock_question, mock_answer)
        print(f"Result: {grade}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n3. Testing Study Guide Generation...")
    try:
        guide = generate_study_guide(mock_student_data)
        print(f"Result: {guide}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n4. Testing Performance Prediction...")
    try:
        prediction = predict_performance(mock_history)
        print(f"Result: {prediction}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n5. Testing Lesson Plan Generation...")
    try:
        plan = generate_lesson_plan("Photosynthesis", "Grade 10", "Biology")
        print(f"Result: {plan}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_ai_functions())
