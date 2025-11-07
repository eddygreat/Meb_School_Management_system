from pydantic import BaseModel

class FaceEnrollResponse(BaseModel):
    user_id: int
    enrolled: bool

class FaceLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
