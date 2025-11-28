from pydantic import BaseSettings, AnyHttpUrl
from typing import List, Union


class Settings(BaseSettings):
    # Core settings
    PROJECT_NAME: str = "School Management System API"
    API_PREFIX: str = "/api"

    # Security
    SECRET_KEY: str

    # Database
    DATABASE_URL: str

    # CORS
    BACKEND_CORS_ORIGINS: Union[str, List[AnyHttpUrl]] = []

    class Config:
        case_sensitive = True


settings = Settings()
