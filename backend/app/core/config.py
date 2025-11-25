from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Pydantic-settings will automatically look for a .env file for local development.
    """
    # Core application settings
    APP_NAME: str = "School Management System"
    API_PREFIX: str = "/api"

    # Security and authentication
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # Database settings
    DATABASE_URL: str

    # CORS settings - a list of allowed origins
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    # Email settings
    EMAIL_FROM: str = "noreply@example.com"

    # Payment gateway secrets (optional)
    PAYSTACK_SECRET_KEY: str | None = None
    FLUTTERWAVE_SECRET_KEY: str | None = None

    class Config:
        # Load local settings first, then fall back to the standard .env
        env_file = ".env.local", ".env"
        env_file_encoding = "utf-8"

settings = Settings()
