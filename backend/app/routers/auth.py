from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.deps import get_db
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.auth import Token, LoginRequest, RegisterAdmin, UserCreate
from app.schemas.user import UserOut
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/register-admin", response_model=UserOut)
async def register_admin(payload: RegisterAdmin, db: AsyncSession = Depends(get_db)):
    existing = await User.get_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="Admin user with this email already exists.")

    # Create the user with a hashed password in a single transaction to avoid
    # intermediate state where the user exists with an empty password.
    user = User(email=payload.email, full_name=payload.full_name, role="admin", hashed_password=get_password_hash(payload.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}

@router.post("/register", response_model=UserOut)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    print(f"DEBUG: Registering user {payload.email} with role {payload.role}")
    print(f"DEBUG: Payload dump: {payload.model_dump()}")
    try:
        existing = await User.get_by_email(db, payload.email)
        print(f"DEBUG: Checked existing user: {existing}")
        if existing:
            raise HTTPException(status_code=409, detail="User with this email already exists.")

        hashed_password = get_password_hash(payload.password)
        print("DEBUG: Password hashed")
        user = User(email=payload.email, full_name=payload.full_name, role=payload.role, hashed_password=hashed_password)
        print("DEBUG: User object created")
        db.add(user)
        print("DEBUG: User added to session")
        await db.commit()
        print("DEBUG: Session committed")
        await db.refresh(user)
        print(f"DEBUG: User refreshed: {user.id}")
        return {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}
    except Exception as e:
        print(f"CRITICAL ERROR in register: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await User.get_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not user.check_password(payload.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
