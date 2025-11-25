from typing import AsyncGenerator, List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.db.session import AsyncSessionLocal
from app.core.config import settings
from app.models.user import User, UserRole

# This tells FastAPI where to look for the token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login")

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides a database session for a single request.
    Ensures the session is always closed, even if errors occur.
    """
    async with AsyncSessionLocal() as session:
        yield session

async def get_current_user(db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    """
    Decodes the JWT token, validates it, and returns the current user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await User.get_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

def require_roles(required_roles: List[UserRole]):
    """
    A dependency factory that creates a dependency to check for required user roles.
    """
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The user does not have sufficient privileges",
            )
        return current_user
    return role_checker