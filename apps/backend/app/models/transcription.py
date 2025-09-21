from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base
from app.models.enums import TranscriptionStatus, JobStatus


class Transcription(Base):
    __tablename__ = "transcriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audio_file_id = Column(UUID(as_uuid=True), ForeignKey("audio_files.id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    confidence_score = Column(Numeric(3, 2))
    ai_service = Column(String(50))
    status = Column(String(20), nullable=False, default=TranscriptionStatus.PENDING, index=True)
    job_status = Column(String(20), nullable=False, default=JobStatus.PENDING)
    upload_progress = Column(Integer, default=0)
    error_message = Column(Text)
    processed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    audio_file = relationship("AudioFile", back_populates="transcriptions")
