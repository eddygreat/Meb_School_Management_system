from sqlalchemy import Column, Integer, String, Enum as SQLAlchemyEnum
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import Base
from app.core.security import verify_password, get_password_hash
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"
    parent = "parent"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False)

    @classmethod
    async def get_by_email(cls, db: AsyncSession, email: str):
        """Fetches a user by their email address."""
        result = await db.execute(select(cls).filter(cls.email == email))
        return result.scalars().first()

    def check_password(self, password: str) -> bool:
        """Verifies the provided password against the stored hash."""
        return verify_password(password, self.hashed_password)

    async def set_password(self, db: AsyncSession, new_password: str):
        """Sets a new password for the user."""
        self.hashed_password = get_password_hash(new_password)
        db.add(self)