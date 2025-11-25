from pydantic import BaseModel, EmailStr

# Schema for the JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str

# Schema for the user login request body
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Schema for registering a new admin user
class RegisterAdmin(BaseModel):
    email: EmailStr
    full_name: str
    password: str