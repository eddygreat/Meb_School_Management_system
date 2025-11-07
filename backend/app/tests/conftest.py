import os
os.environ.setdefault('ENV', 'test')
import pytest
import pytest_asyncio
from httpx import AsyncClient
# Import app after ENV is set so Settings picks up ENV=test
from app.main import app

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        yield ac
