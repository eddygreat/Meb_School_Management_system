from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

# Pydantic schema for returning user information, excluding the password.
class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole

    class Config:
        from_attributes = True