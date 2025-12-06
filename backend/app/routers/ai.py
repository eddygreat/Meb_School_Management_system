from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import (
    chat_with_student, 
    generate_lesson_plan,
    grade_assignment,
    generate_study_guide,
    predict_performance
)

router = APIRouter(
    tags=["AI"],
    responses={404: {"description": "Not found"}},
)

class ChatRequest(BaseModel):
    message: str
    context: str = ""

class LessonPlanRequest(BaseModel):
    topic: str
    grade_level: str
    subject: str

class GradeRequest(BaseModel):
    question: str
    answer: str
    rubric: str = ""

class StudyGuideRequest(BaseModel):
    student_data: str

class PredictionRequest(BaseModel):
    student_history: str

@router.post("/chat")
async def chat(request: ChatRequest):
    response = await chat_with_student(request.message, request.context)
    if response.startswith("Error"):
        raise HTTPException(status_code=500, detail=response)
    return {"response": response}

@router.post("/generate-lesson")
async def create_lesson_plan(request: LessonPlanRequest):
    response = await generate_lesson_plan(request.topic, request.grade_level, request.subject)
    if response.startswith("Error"):
        raise HTTPException(status_code=500, detail=response)
    return {"lesson_plan": response}

@router.post("/grade")
async def grade_student_assignment(request: GradeRequest):
    response = await grade_assignment(request.question, request.answer, request.rubric)
    if response.startswith("Error"):
        raise HTTPException(status_code=500, detail=response)
    # The response is expected to be JSON string, but we return it as is or parse it if needed
    # For now, returning as raw string or let frontend parse it
    return {"grading_result": response}

@router.post("/study-guide")
async def create_study_guide(request: StudyGuideRequest):
    response = await generate_study_guide(request.student_data)
    if response.startswith("Error"):
        raise HTTPException(status_code=500, detail=response)
    return {"study_guide": response}

@router.post("/predict")
async def predict_student_performance(request: PredictionRequest):
    response = await predict_performance(request.student_history)
    if response.startswith("Error"):
        raise HTTPException(status_code=500, detail=response)
    return {"prediction": response}
