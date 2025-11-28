from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "SchoolMS"
    ENV: str = "dev"
    API_PREFIX: str = "/api"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str
    BACKEND_CORS_ORIGINS: str = '["http://localhost:5173"]'
    REDIS_URL: str = "redis://localhost:6379/0"
    EMAIL_FROM: str = "noreply@example.com"
    PAYSTACK_SECRET_KEY: str | None = None
    FLUTTERWAVE_SECRET_KEY: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
