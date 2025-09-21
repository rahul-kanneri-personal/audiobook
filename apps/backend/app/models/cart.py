from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id"), nullable=False, index=True)
    session_id = Column(String(255), index=True)
    audiobook_id = Column(UUID(as_uuid=True), ForeignKey("audiobooks.id"), nullable=False, index=True)
    price_cents = Column(Integer, nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationships
    user = relationship("UserProfile", back_populates="cart_items")
    audiobook = relationship("Audiobook", back_populates="cart_items")

    __table_args__ = (
        {"extend_existing": True},
    )
