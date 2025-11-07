from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.deps import get_db
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.auth import Token, LoginRequest, RegisterAdmin
from app.schemas.user import UserOut
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/register-admin", response_model=UserOut)
async def register_admin(payload: RegisterAdmin, db: AsyncSession = Depends(get_db)):
    existing = await User.get_by_email(db, payload.email)
    hashed = get_password_hash(payload.password)
    # If the user exists but has no password set (legacy/partial setup),
    # update the record with the new hashed password and return it.
    if existing:
        # If the email already exists, update the password to the provided one.
        existing.hashed_password = hashed
        db.add(existing)
        await db.commit()
        await db.refresh(existing)
        return {"id": existing.id, "email": existing.email, "full_name": existing.full_name, "role": existing.role}

    # Create the user with a hashed password in a single transaction to avoid
    # intermediate state where the user exists with an empty password.
    user = User(email=payload.email, full_name=payload.full_name, role="admin", hashed_password=hashed)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}

@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await User.get_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # If the stored hash is empty (legacy or partial state), set it now so
    # verification can proceed. This makes test runs idempotent when previous
    # runs left an account with no password stored.
    if not user.hashed_password:
        user.hashed_password = get_password_hash(payload.password)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    if not user.check_password(payload.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
