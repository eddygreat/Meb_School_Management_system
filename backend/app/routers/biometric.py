import base64
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, get_current_user
from app.core.security import create_access_token
from app.models.user import User
from app.models.biometric import FaceProfile
from app.schemas.biometric import FaceEnrollResponse, FaceLoginResponse
from app.services.ai_service import verify_face

router = APIRouter()

@router.post("/enroll", response_model=FaceEnrollResponse)
async def enroll_face(
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Read image bytes
    image_bytes = await image.read()
    
    # Encode to base64 for storage
    image_b64 = base64.b64encode(image_bytes).decode('utf-8')
    
    # Check if profile exists
    existing = await db.execute(select(FaceProfile).where(FaceProfile.user_id == user.id))
    fp = existing.scalar_one_or_none()
    
    if fp:
        fp.face_image_data = image_b64
        db.add(fp)
    else:
        fp = FaceProfile(user_id=user.id, face_image_data=image_b64)
        db.add(fp)
        
    await db.commit()
    return FaceEnrollResponse(user_id=user.id, enrolled=True)

@router.post("/login", response_model=FaceLoginResponse)
async def login_face(
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    # Read login image bytes
    login_image_bytes = await image.read()
    
    # Iterate through all users with face profiles (inefficient for large scale, but fine for demo)
    # In production, you'd use a vector database or face ID service
    result = await db.execute(select(FaceProfile))
    profiles = result.scalars().all()
    
    matched_user_id = None
    
    for fp in profiles:
        if not fp.face_image_data:
            continue
            
        # Decode stored image
        stored_image_bytes = base64.b64decode(fp.face_image_data)
        
        # Verify with Gemini
        is_match = verify_face(stored_image_bytes, login_image_bytes)
        
        if is_match:
            matched_user_id = fp.user_id
            break
    
    if not matched_user_id:
        raise HTTPException(status_code=401, detail="Face not recognized")
        
    # Get user
    user_res = await db.execute(select(User).where(User.id == matched_user_id))
    user = user_res.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return FaceLoginResponse(access_token=token)
