from sqlalchemy import Column, String, Text, Integer, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base
from app.models.enums import AudiobookStatus


class Audiobook(Base):
    __tablename__ = "audiobooks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False, index=True)
    slug = Column(String(500), unique=True, nullable=False, index=True)
    isbn = Column(String(20))
    description = Column(Text)
    ai_summary = Column(Text)
    duration_seconds = Column(Integer)
    price_cents = Column(Integer, nullable=False, index=True)
    sample_url = Column(String)
    cover_image_url = Column(String)
    publication_date = Column(Date, index=True)
    language = Column(String(10), default="en")
    status = Column(String(20), nullable=False, default=AudiobookStatus.DRAFT, index=True)
    author_name = Column(String(255), nullable=False)
    narrator_name = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    categories = relationship("AudiobookCategory", back_populates="audiobook")
    audio_files = relationship("AudioFile", back_populates="audiobook")
    reviews = relationship("Review", back_populates="audiobook")
    cart_items = relationship("CartItem", back_populates="audiobook")
    order_items = relationship("OrderItem", back_populates="audiobook")
    library_items = relationship("UserLibrary", back_populates="audiobook")
    download_logs = relationship("DownloadLog", back_populates="audiobook")


class AudiobookCategory(Base):
    __tablename__ = "audiobook_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audiobook_id = Column(UUID(as_uuid=True), ForeignKey("audiobooks.id"), nullable=False, index=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False, index=True)

    # Relationships
    audiobook = relationship("Audiobook", back_populates="categories")
    category = relationship("Category", back_populates="audiobook_categories")

    __table_args__ = (
        {"extend_existing": True},
    )
