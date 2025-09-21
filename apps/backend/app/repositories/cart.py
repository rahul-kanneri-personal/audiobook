from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.cart import CartItem
from .base import BaseRepository


class CartRepository(BaseRepository[CartItem]):
    """Repository for cart operations."""

    def __init__(self, db: Session):
        super().__init__(CartItem, db)

    def get_user_cart(self, user_id: UUID) -> List[CartItem]:
        """Get all items in a user's cart."""
        return self.get_multi_by_field("user_id", user_id)

    def get_session_cart(self, session_id: str) -> List[CartItem]:
        """Get all items in a session's cart."""
        return self.get_multi_by_field("session_id", session_id)

    def get_cart_item(self, user_id: UUID, audiobook_id: UUID) -> Optional[CartItem]:
        """Get a specific cart item."""
        return self.db.query(CartItem).filter(
            and_(
                CartItem.user_id == user_id,
                CartItem.audiobook_id == audiobook_id
            )
        ).first()

    def get_session_cart_item(self, session_id: str, audiobook_id: UUID) -> Optional[CartItem]:
        """Get a specific cart item for a session."""
        return self.db.query(CartItem).filter(
            and_(
                CartItem.session_id == session_id,
                CartItem.audiobook_id == audiobook_id
            )
        ).first()

    def add_to_cart(
        self,
        audiobook_id: UUID,
        price_cents: int,
        user_id: Optional[UUID] = None,
        session_id: Optional[str] = None
    ) -> CartItem:
        """Add an item to cart."""
        if user_id:
            # Check if item already exists in user's cart
            existing_item = self.get_cart_item(user_id, audiobook_id)
            if existing_item:
                return existing_item
        
        if session_id:
            # Check if item already exists in session's cart
            existing_item = self.get_session_cart_item(session_id, audiobook_id)
            if existing_item:
                return existing_item

        cart_item_data = {
            "audiobook_id": audiobook_id,
            "price_cents": price_cents,
            "user_id": user_id,
            "session_id": session_id
        }
        return self.create(cart_item_data)

    def remove_from_cart(
        self,
        audiobook_id: UUID,
        user_id: Optional[UUID] = None,
        session_id: Optional[str] = None
    ) -> bool:
        """Remove an item from cart."""
        if user_id:
            cart_item = self.get_cart_item(user_id, audiobook_id)
        elif session_id:
            cart_item = self.get_session_cart_item(session_id, audiobook_id)
        else:
            return False

        if cart_item:
            self.db.delete(cart_item)
            self.db.commit()
            return True
        return False

    def clear_cart(
        self,
        user_id: Optional[UUID] = None,
        session_id: Optional[str] = None
    ) -> int:
        """Clear all items from cart."""
        if user_id:
            items = self.get_user_cart(user_id)
        elif session_id:
            items = self.get_session_cart(session_id)
        else:
            return 0

        count = len(items)
        for item in items:
            self.db.delete(item)
        self.db.commit()
        return count

    def get_cart_total(self, user_id: Optional[UUID] = None, session_id: Optional[str] = None) -> int:
        """Get total price of cart items."""
        if user_id:
            items = self.get_user_cart(user_id)
        elif session_id:
            items = self.get_session_cart(session_id)
        else:
            return 0

        return sum(item.price_cents for item in items)

    def transfer_session_cart_to_user(self, session_id: str, user_id: UUID) -> int:
        """Transfer session cart items to user cart."""
        session_items = self.get_session_cart(session_id)
        transferred_count = 0

        for item in session_items:
            # Check if user already has this item
            existing_item = self.get_cart_item(user_id, item.audiobook_id)
            if not existing_item:
                # Transfer the item
                item.user_id = user_id
                item.session_id = None
                transferred_count += 1
            else:
                # Remove duplicate session item
                self.db.delete(item)

        self.db.commit()
        return transferred_count
