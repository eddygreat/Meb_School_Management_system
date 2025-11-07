from sqlalchemy.ext.asyncio import AsyncSession
from app.models.security import AuditLog

async def write_audit(db: AsyncSession, actor_user_id: int | None, action: str, target: str = "", ip: str = ""):
    al = AuditLog(actor_user_id=actor_user_id, action=action, target=target, ip=ip)
    db.add(al)
    await db.commit()
