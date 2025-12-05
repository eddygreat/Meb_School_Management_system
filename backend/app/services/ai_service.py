import os
import requests
import base64
import json
from app.core.config import settings

GEMINI_API_KEY = settings.GEMINI_API_KEY

def get_ai_response(prompt: str, image_parts: list = None) -> str:
    """
    Generates a response from the Gemini model based on the provided prompt and optional images.
    """
    if not GEMINI_API_KEY:
        return "Error: Gemini API Key not configured. Please add GEMINI_API_KEY to your .env file."
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    parts = [{"text": prompt}]
    
    if image_parts:
        for img in image_parts:
            # Convert bytes to base64 string
            if isinstance(img['data'], bytes):
                b64_data = base64.b64encode(img['data']).decode('utf-8')
            else:
                b64_data = img['data'] # Assume it's already base64 string if not bytes
                
            parts.append({
                "inline_data": {
                    "mime_type": img['mime_type'],
                    "data": b64_data
                }
            })
            
    payload = {
        "contents": [{
            "parts": parts
        }]
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=30)
        if response.status_code != 200:
            return f"Error: API request failed with status {response.status_code}: {response.text}"
            
        data = response.json()
        # Extract text from response
        try:
            return data['candidates'][0]['content']['parts'][0]['text']
        except (KeyError, IndexError):
            return "Error: Unexpected response format from Gemini API."
            
    except Exception as e:
        return f"Error generating response: {str(e)}"

def generate_lesson_plan(topic: str, grade_level: str, subject: str) -> str:
    """
    Generates a structured lesson plan.
    """
    prompt = f"""
    Create a detailed lesson plan for a {grade_level} {subject} class on the topic: "{topic}".
    
    Structure the response with the following sections using Markdown:
    1. **Lesson Objectives**
    2. **Materials Needed**
    3. **Introduction (10 mins)**
    4. **Main Activity (25 mins)**
    5. **Assessment/Quiz (5 questions with answers)**
    6. **Conclusion**
    """
    return get_ai_response(prompt)

def chat_with_student(message: str, context: str = "") -> str:
    """
    Responds to a student's query acting as a helpful school assistant.
    """
    system_prompt = """
    You are MebBot, a helpful and friendly AI assistant for the Meb School Management System.
    Your goal is to assist students with their academic queries, study tips, and general school information.
    Be encouraging, concise, and professional.
    """
    
    full_prompt = f"{system_prompt}\n\nContext: {context}\n\nStudent: {message}\nMebBot:"
    return get_ai_response(full_prompt)

def verify_face(enrolled_img_data: bytes, login_img_data: bytes) -> bool:
    """
    Verifies if the person in the login image matches the enrolled image using Gemini Vision.
    """
    if not GEMINI_API_KEY:
        print("Gemini API Key missing for face verification")
        return False

    prompt = """
    Compare these two images. 
    Does the person in the second image appear to be the same person as in the first image?
    Ignore minor differences like lighting, glasses, or facial hair.
    Focus on key facial features.
    
    Return ONLY the word "MATCH" if they are the same person, or "NO_MATCH" if they are different.
    Do not provide any other text.
    """
    
    image_parts = [
        {"mime_type": "image/jpeg", "data": enrolled_img_data},
        {"mime_type": "image/jpeg", "data": login_img_data}
    ]
    
    response = get_ai_response(prompt, image_parts)
    return "MATCH" in response.strip().upper()

def grade_assignment(question: str, answer: str, rubric: str = "") -> str:
    """
    Grades a student's answer based on the question and optional rubric.
    """
    prompt = f"""
    You are an expert teacher. Grade the following student answer.
    
    Question: {question}
    Student Answer: {answer}
    Rubric/Criteria: {rubric if rubric else "Grade based on accuracy, clarity, and completeness."}
    
    Provide:
    1. A score out of 10.
    2. Brief feedback explaining the score.
    3. One tip for improvement.
    
    Format as JSON: {{ "score": 8, "feedback": "...", "tip": "..." }}
    """
    return get_ai_response(prompt)

def generate_study_guide(student_data: str) -> str:
    """
    Generates a personalized study guide based on student performance data.
    """
    prompt = f"""
    Create a personalized study guide for a student with the following performance data:
    {student_data}
    
    Identify weak areas and suggest specific topics to review, along with 3 practice questions for the weakest subject.
    """
    return get_ai_response(prompt)

def predict_performance(student_history: str) -> str:
    """
    Predicts future performance based on historical data.
    """
    prompt = f"""
    Analyze the following student grade history and attendance records:
    {student_history}
    
    Predict the student's likely performance in the upcoming final exams.
    Identify any "At Risk" signs (e.g., declining grades, low attendance).
    Provide a "Success Probability" score (Low/Medium/High).
    """
    return get_ai_response(prompt)
