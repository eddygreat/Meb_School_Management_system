import os
os.environ.setdefault('ENV','test')
os.environ.setdefault('SECRET_KEY','testingsecret')
os.environ.setdefault('DATABASE_URL','sqlite+aiosqlite:///./test_app.db')

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.user import User

client = TestClient(app)

r = client.post('/api/auth/register-admin', json={"email":"admin@test.com","full_name":"Admin Test","password":"Admin123!"})
print('register status:', r.status_code, r.text)

# Check DB
import asyncio
async def dump_user():
    async with AsyncSessionLocal() as s:
        res = await s.execute(select(User).where(User.email=='admin@test.com'))
        u = res.scalar_one_or_none()
        if not u:
            print('no user')
            return
        print('user id:', u.id)
        print('hashed_password repr:', repr(u.hashed_password))

asyncio.get_event_loop().run_until_complete(dump_user())

r2 = client.post('/api/auth/login', json={"email":"admin@test.com","password":"Admin123!"})
print('login status:', r2.status_code, r2.text)
