from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base
from app.models.enums import UserRole


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_user_id = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    role = Column(String(20), nullable=False, default=UserRole.CUSTOMER)
    avatar_url = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id"), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    created_by_user = relationship("UserProfile", remote_side=[id])
    reviews = relationship("Review", back_populates="user")
    cart_items = relationship("CartItem", back_populates="user")
    orders = relationship("Order", back_populates="user")
    library_items = relationship("UserLibrary", back_populates="user")
    download_logs = relationship("DownloadLog", back_populates="user")
