from datetime import datetime, timedelta
import secrets
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, require_roles
from app.models.user import User
from app.models.security import PasswordResetToken, AuditLog
from app.tasks.email import send_email
from app.core.config import settings

router = APIRouter()

@router.post('/password-reset/request')
async def request_password_reset(email: str, db: AsyncSession = Depends(get_db)):
    user_res = await db.execute(select(User).where(User.email == email))
    user = user_res.scalar_one_or_none()
    # Always respond OK to avoid leaking existence
    if user:
        token = secrets.token_urlsafe(24)
        prt = PasswordResetToken(user_id=user.id, token=token, expires_at=datetime.utcnow() + timedelta(hours=1))
        db.add(prt)
        await db.commit()
        # Send email via background task with token link
        reset_link = f"http://localhost:5173/password-reset/confirm?token={token}"
        subject = f"{settings.APP_NAME} Password Reset"
        body = f"Hello {user.full_name},\n\nUse the link below to reset your password (valid for 1 hour):\n{reset_link}\n\nIf you did not request this, please ignore."
        send_email.delay(user.email, subject, body)
    return {"ok": True}

@router.post('/password-reset/confirm')
async def confirm_password_reset(token: str, new_password: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(PasswordResetToken).where(PasswordResetToken.token == token))
    prt = res.scalar_one_or_none()
    if not prt or prt.used_at is not None or prt.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail='Invalid or expired token')
    user_res = await db.execute(select(User).where(User.id == prt.user_id))
    user = user_res.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    await user.set_password(db, new_password)
    prt.used_at = datetime.utcnow()
    db.add(prt)
    await db.commit()
    return {"ok": True}

@router.get('/audit', response_model=list[dict])
async def list_audit(limit: int = 50, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    res = await db.execute(select(AuditLog).order_by(AuditLog.id.desc()))
    logs = [
        {"id": a.id, "actor_user_id": a.actor_user_id, "action": a.action, "target": a.target, "ip": a.ip, "created_at": a.created_at.isoformat()}
        for a in res.scalars().all()[:limit]
    ]
    return logs
