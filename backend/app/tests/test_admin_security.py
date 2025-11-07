import os
os.environ.setdefault('ENV', 'test')
os.environ.setdefault('SECRET_KEY', 'testingsecret')
os.environ.setdefault('DATABASE_URL', 'sqlite+aiosqlite:///./test_app.db')

import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.security import PasswordResetToken

client = TestClient(app)


def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}


def _register_and_login_admin():
    # Register admin
    r = client.post('/api/auth/register-admin', json={
        "email": "admin@test.com",
        "full_name": "Admin Test",
        "password": "Admin123!"
    })
    assert r.status_code in (200, 400)  # may already exist
    # Login
    r = client.post('/api/auth/login', json={"email": "admin@test.com", "password": "Admin123!"})
    assert r.status_code == 200
    return r.json()["access_token"]


def test_admin_users_crud():
    token = _register_and_login_admin()

    # Create user
    r = client.post('/api/admin/users', json={
        "email": "user1@test.com", "full_name": "User One", "role": "teacher", "password": "Pass123!"
    }, headers=auth_headers(token))
    assert r.status_code == 200
    user = r.json()
    uid = user["id"]

    # Update user
    r = client.put(f'/api/admin/users/{uid}', json={"full_name": "User 1", "role": "parent", "is_active": True}, headers=auth_headers(token))
    assert r.status_code == 200
    assert r.json()["role"] == "parent"

    # Reset password
    r = client.post(f'/api/admin/users/{uid}/reset-password', json={"password": "NewPass!"}, headers=auth_headers(token))
    assert r.status_code == 200

    # Delete user
    r = client.delete(f'/api/admin/users/{uid}', headers=auth_headers(token))
    assert r.status_code == 200


def test_password_reset_flow():
    token = _register_and_login_admin()

    # Create a user to reset
    r = client.post('/api/admin/users', json={
        "email": "resetme@test.com", "full_name": "Reset Me", "role": "student", "password": "OldPass1!"
    }, headers=auth_headers(token))
    assert r.status_code == 200

    # Request password reset
    r = client.post('/api/security/password-reset/request', params={"email": "resetme@test.com"})
    assert r.status_code == 200

    # Fetch token from DB
    async def _get_latest_token():
        async with AsyncSessionLocal() as s:
            res = await s.execute(select(PasswordResetToken).order_by(PasswordResetToken.id.desc()))
            prt = res.scalars().first()
            return prt.token if prt else None
    prt_token = asyncio.get_event_loop().run_until_complete(_get_latest_token())
    assert prt_token

    # Confirm reset
    r = client.post('/api/security/password-reset/confirm', params={"token": prt_token, "new_password": "NewPass2!"})
    assert r.status_code == 200

    # Login succeeds with new password
    r = client.post('/api/auth/login', json={"email": "resetme@test.com", "password": "NewPass2!"})
    assert r.status_code == 200
