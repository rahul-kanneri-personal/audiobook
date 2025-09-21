from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base
from app.models.enums import OrderStatus


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id"), nullable=False, index=True)
    status = Column(String(20), nullable=False, default=OrderStatus.PENDING, index=True)
    total_cents = Column(Integer, nullable=False)
    tax_cents = Column(Integer, default=0)
    payment_method = Column(String(50))
    payment_intent_id = Column(String(255))
    billing_email = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("UserProfile", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    library_items = relationship("UserLibrary", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, index=True)
    audiobook_id = Column(UUID(as_uuid=True), ForeignKey("audiobooks.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    price_cents = Column(Integer, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="order_items")
    audiobook = relationship("Audiobook", back_populates="order_items")
