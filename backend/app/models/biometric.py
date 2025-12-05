from sqlalchemy import Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class FaceProfile(Base):
    __tablename__ = "face_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    face_image_data: Mapped[str] = mapped_column(String, nullable=True) # Store base64 image
    __table_args__ = (UniqueConstraint('user_id', name='uq_face_user'),)
