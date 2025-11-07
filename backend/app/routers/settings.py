from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, require_roles
from app.models.settings import Setting
from app.utils.audit import write_audit
from app.core.deps import get_current_user

router = APIRouter()

@router.get('/')
async def list_settings(db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    res = await db.execute(select(Setting))
    return [{"key": s.key, "value": s.value} for s in res.scalars().all()]

@router.get('/{key}')
async def get_setting(key: str, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    res = await db.execute(select(Setting).where(Setting.key == key))
    s = res.scalar_one_or_none()
    if not s:
        raise HTTPException(status_code=404, detail='Not found')
    return {"key": s.key, "value": s.value}

@router.post('/')
async def set_setting(key: str, value: str, db: AsyncSession = Depends(get_db), current=Depends(get_current_user), user=Depends(require_roles('admin'))):
    res = await db.execute(select(Setting).where(Setting.key == key))
    s = res.scalar_one_or_none()
    if s:
        s.value = value
        db.add(s)
    else:
        s = Setting(key=key, value=value)
        db.add(s)
    await db.commit()
    await write_audit(db, current.id, 'settings.set', f'{key}')
    return {"key": s.key, "value": s.value}
