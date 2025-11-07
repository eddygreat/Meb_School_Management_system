from datetime import time
from sqlalchemy import Integer, String, ForeignKey, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class SchoolClass(Base):
    __tablename__ = "classes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)

class Room(Base):
    __tablename__ = "rooms"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    capacity: Mapped[int] = mapped_column(Integer, default=40)

class Subject(Base):
    __tablename__ = "subjects"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)

class TeacherSubject(Base):
    __tablename__ = "teacher_subjects"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    teacher_id: Mapped[int] = mapped_column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), index=True)
    subject_id: Mapped[int] = mapped_column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), index=True)
    __table_args__ = (UniqueConstraint('teacher_id', 'subject_id', name='uq_teacher_subject'),)

class TimeSlot(Base):
    __tablename__ = "time_slots"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    day_of_week: Mapped[int] = mapped_column(Integer)  # 0=Mon ... 6=Sun
    start_time: Mapped[time] = mapped_column(Time)
    end_time: Mapped[time] = mapped_column(Time)
    __table_args__ = (UniqueConstraint('day_of_week','start_time','end_time', name='uq_day_time'),)

class ScheduleEntry(Base):
    __tablename__ = "schedule_entries"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    class_id: Mapped[int] = mapped_column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), index=True)
    room_id: Mapped[int] = mapped_column(Integer, ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)
    subject_id: Mapped[int] = mapped_column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), index=True)
    teacher_id: Mapped[int] = mapped_column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), index=True)
    time_slot_id: Mapped[int] = mapped_column(Integer, ForeignKey("time_slots.id", ondelete="CASCADE"), index=True)
    __table_args__ = (UniqueConstraint('class_id','time_slot_id', name='uq_class_timeslot'),)
