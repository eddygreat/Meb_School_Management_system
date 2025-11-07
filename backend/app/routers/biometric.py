import hashlib
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, get_current_user
from app.core.security import create_access_token
from app.models.user import User
from app.models.biometric import FaceProfile
from app.schemas.biometric import FaceEnrollResponse, FaceLoginResponse

router = APIRouter()

async def _file_sha256(file: UploadFile) -> str:
    h = hashlib.sha256()
    while True:
        chunk = await file.read(8192)
        if not chunk:
            break
        h.update(chunk)
    await file.seek(0)
    return h.hexdigest()

@router.post("/enroll", response_model=FaceEnrollResponse)
async def enroll_face(
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    face_hash = await _file_sha256(image)
    # upsert style: if exists for user, update; else create
    existing = await db.execute(select(FaceProfile).where(FaceProfile.user_id == user.id))
    fp = existing.scalar_one_or_none()
    if fp:
        fp.face_hash = face_hash
        db.add(fp)
    else:
        fp = FaceProfile(user_id=user.id, face_hash=face_hash)
        db.add(fp)
    await db.commit()
    return FaceEnrollResponse(user_id=user.id, enrolled=True)

@router.post("/login", response_model=FaceLoginResponse)
async def login_face(
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    face_hash = await _file_sha256(image)
    res = await db.execute(select(FaceProfile).where(FaceProfile.face_hash == face_hash))
    fp = res.scalar_one_or_none()
    if not fp:
        raise HTTPException(status_code=401, detail="Face not recognized")
    # find user
    user_res = await db.execute(select(User).where(User.id == fp.user_id))
    user = user_res.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return FaceLoginResponse(access_token=token)
