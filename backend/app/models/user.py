from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import Base
from app.core.security import get_password_hash, verify_password
import logging
logger = logging.getLogger(__name__)

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50), index=True)  # admin, teacher, parent, student
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str):
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_id(db: AsyncSession, id_: int):
        result = await db.execute(select(User).where(User.id == id_))
        return result.scalar_one_or_none()

    async def set_password(self, db: AsyncSession, password: str):
        try:
            hp = get_password_hash(password)
            self.hashed_password = hp
            db.add(self)
            await db.commit()
            await db.refresh(self)
        except Exception as exc:
            logger.exception("Failed to set password for user %s: %s", getattr(self, 'email', '<unknown>'), exc)
            raise

    def check_password(self, password: str) -> bool:
        return verify_password(password, self.hashed_password)
