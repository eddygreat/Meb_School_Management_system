import asyncio
from httpx import AsyncClient
from app.main import app
from app.core.config import settings

async def reproduce_signup():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        print("Attempting to register user...")
        response = await ac.post("/api/auth/register", json={
            "email": "test_reproduce_500@example.com",
            "password": "password123",
            "full_name": "Test User",
            "role": "student"
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    import os
    # Ensure env vars are loaded for local test if needed context is missing
    # Assuming .env is loaded by app.core.config or we manually load here
    # But since we run this with python, we rely on the app's loading mechanism
    asyncio.run(reproduce_signup())
