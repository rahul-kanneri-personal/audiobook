from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base


class UserLibrary(Base):
    __tablename__ = "user_library"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id"), nullable=False, index=True)
    audiobook_id = Column(UUID(as_uuid=True), ForeignKey("audiobooks.id"), nullable=False, index=True)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, index=True)
    download_count = Column(Integer, default=0)
    last_downloaded_at = Column(DateTime(timezone=True))
    purchased_at = Column(DateTime(timezone=True), nullable=False, index=True)

    # Relationships
    user = relationship("UserProfile", back_populates="library_items")
    audiobook = relationship("Audiobook", back_populates="library_items")
    order = relationship("Order", back_populates="library_items")

    __table_args__ = (
        {"extend_existing": True},
    )
