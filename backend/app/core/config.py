from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
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

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI
    GEMINI_API_KEY: str | None = None

    model_config = SettingsConfigDict(env_file=("backend/.env", ".env"), case_sensitive=True, extra="ignore")

    from pydantic import field_validator

    @field_validator("DATABASE_URL")
    @classmethod
    def clean_database_url(cls, v: str) -> str:
        if v and "&channel_binding=require" in v:
            return v.replace("&channel_binding=require", "")
        return v


settings = Settings()
