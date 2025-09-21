from sqlalchemy import Column, String, Integer, BigInteger, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base


class AudioFile(Base):
    __tablename__ = "audio_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audiobook_id = Column(UUID(as_uuid=True), ForeignKey("audiobooks.id"), nullable=False, index=True)
    chapter_number = Column(Integer)
    chapter_title = Column(String(255))
    file_url = Column(String, nullable=False)
    file_size_bytes = Column(BigInteger)
    duration_seconds = Column(Integer)
    mime_type = Column(String(100))
    checksum = Column(String(64))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    audiobook = relationship("Audiobook", back_populates="audio_files")
    transcriptions = relationship("Transcription", back_populates="audio_file")
    download_logs = relationship("DownloadLog", back_populates="audio_file")

    __table_args__ = (
        {"extend_existing": True},
    )
