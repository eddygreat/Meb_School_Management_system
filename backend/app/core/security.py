from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

# Use bcrypt for compatibility with existing hashes/tests. Keep deprecated="auto"
# so passlib can upgrade hashes later if configured.
# Use Argon2 for password hashing. Argon2 avoids bcrypt's 72-byte limit and
# doesn't depend on a potentially problematic bcrypt binary in the container.
# `argon2-cffi` is included in requirements.txt.
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_minutes: int | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
