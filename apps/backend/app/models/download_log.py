from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base


class DownloadLog(Base):
    __tablename__ = "download_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id"), nullable=False, index=True)
    audiobook_id = Column(UUID(as_uuid=True), ForeignKey("audiobooks.id"), nullable=False, index=True)
    audio_file_id = Column(UUID(as_uuid=True), ForeignKey("audio_files.id"), index=True)
    ip_address = Column(INET)
    user_agent = Column(Text)
    download_url = Column(String)
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationships
    user = relationship("UserProfile", back_populates="download_logs")
    audiobook = relationship("Audiobook", back_populates="download_logs")
    audio_file = relationship("AudioFile", back_populates="download_logs")
