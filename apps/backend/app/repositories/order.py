from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import desc, and_

from app.models.order import Order, OrderItem
from app.models.enums import OrderStatus
from .base import BaseRepository


class OrderRepository(BaseRepository[Order]):
    """Repository for order operations."""

    def __init__(self, db: Session):
        super().__init__(Order, db)

    def get_by_order_number(self, order_number: str) -> Optional[Order]:
        """Get order by order number."""
        return self.get_by_field("order_number", order_number)

    def get_by_user(self, user_id: UUID) -> List[Order]:
        """Get all orders for a user."""
        return self.db.query(Order).filter(
            Order.user_id == user_id
        ).order_by(desc(Order.created_at)).all()

    def get_by_status(self, status: OrderStatus) -> List[Order]:
        """Get orders by status."""
        return self.get_multi_by_field("status", status)

    def get_recent_orders(self, limit: int = 10) -> List[Order]:
        """Get recent orders."""
        return self.db.query(Order).order_by(desc(Order.created_at)).limit(limit).all()

    def get_user_recent_orders(self, user_id: UUID, limit: int = 5) -> List[Order]:
        """Get recent orders for a user."""
        return self.db.query(Order).filter(
            Order.user_id == user_id
        ).order_by(desc(Order.created_at)).limit(limit).all()

    def create_order(
        self,
        order_number: str,
        user_id: UUID,
        total_cents: int,
        tax_cents: int = 0,
        payment_method: Optional[str] = None,
        payment_intent_id: Optional[str] = None,
        billing_email: Optional[str] = None
    ) -> Order:
        """Create a new order."""
        order_data = {
            "order_number": order_number,
            "user_id": user_id,
            "status": OrderStatus.PENDING,
            "total_cents": total_cents,
            "tax_cents": tax_cents,
            "payment_method": payment_method,
            "payment_intent_id": payment_intent_id,
            "billing_email": billing_email
        }
        return self.create(order_data)

    def update_status(self, order_id: UUID, status: OrderStatus) -> Optional[Order]:
        """Update order status."""
        order = self.get(order_id)
        if order:
            return self.update(order, {"status": status})
        return None

    def complete_order(self, order_id: UUID) -> Optional[Order]:
        """Mark order as completed."""
        return self.update_status(order_id, OrderStatus.COMPLETED)

    def fail_order(self, order_id: UUID) -> Optional[Order]:
        """Mark order as failed."""
        return self.update_status(order_id, OrderStatus.FAILED)

    def refund_order(self, order_id: UUID) -> Optional[Order]:
        """Mark order as refunded."""
        return self.update_status(order_id, OrderStatus.REFUNDED)


class OrderItemRepository(BaseRepository[OrderItem]):
    """Repository for order item operations."""

    def __init__(self, db: Session):
        super().__init__(OrderItem, db)

    def get_by_order(self, order_id: UUID) -> List[OrderItem]:
        """Get all items for an order."""
        return self.get_multi_by_field("order_id", order_id)

    def get_by_audiobook(self, audiobook_id: UUID) -> List[OrderItem]:
        """Get all order items for an audiobook."""
        return self.get_multi_by_field("audiobook_id", audiobook_id)

    def create_order_item(
        self,
        order_id: UUID,
        audiobook_id: UUID,
        title: str,
        price_cents: int
    ) -> OrderItem:
        """Create a new order item."""
        order_item_data = {
            "order_id": order_id,
            "audiobook_id": audiobook_id,
            "title": title,
            "price_cents": price_cents
        }
        return self.create(order_item_data)

    def create_order_from_cart(
        self,
        order_number: str,
        user_id: UUID,
        cart_items: List,
        tax_cents: int = 0,
        payment_method: Optional[str] = None,
        payment_intent_id: Optional[str] = None,
        billing_email: Optional[str] = None
    ) -> Order:
        """Create an order from cart items."""
        # Calculate total
        total_cents = sum(item.price_cents for item in cart_items)
        
        # Create order
        order_repo = OrderRepository(self.db)
        order = order_repo.create_order(
            order_number=order_number,
            user_id=user_id,
            total_cents=total_cents,
            tax_cents=tax_cents,
            payment_method=payment_method,
            payment_intent_id=payment_intent_id,
            billing_email=billing_email
        )
        
        # Create order items
        for cart_item in cart_items:
            self.create_order_item(
                order_id=order.id,
                audiobook_id=cart_item.audiobook_id,
                title=cart_item.audiobook.title,
                price_cents=cart_item.price_cents
            )
        
        return order
