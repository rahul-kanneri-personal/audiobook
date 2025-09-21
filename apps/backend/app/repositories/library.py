from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import desc, and_

from app.models.library import UserLibrary
from .base import BaseRepository


class LibraryRepository(BaseRepository[UserLibrary]):
    """Repository for user library operations."""

    def __init__(self, db: Session):
        super().__init__(UserLibrary, db)

    def get_user_library(self, user_id: UUID) -> List[UserLibrary]:
        """Get all items in a user's library."""
        return self.db.query(UserLibrary).filter(
            UserLibrary.user_id == user_id
        ).order_by(desc(UserLibrary.purchased_at)).all()

    def get_user_audiobook(self, user_id: UUID, audiobook_id: UUID) -> Optional[UserLibrary]:
        """Get a specific audiobook from user's library."""
        return self.db.query(UserLibrary).filter(
            and_(
                UserLibrary.user_id == user_id,
                UserLibrary.audiobook_id == audiobook_id
            )
        ).first()

    def get_recent_purchases(self, user_id: UUID, limit: int = 10) -> List[UserLibrary]:
        """Get recent purchases for a user."""
        return self.db.query(UserLibrary).filter(
            UserLibrary.user_id == user_id
        ).order_by(desc(UserLibrary.purchased_at)).limit(limit).all()

    def get_most_downloaded(self, user_id: UUID, limit: int = 10) -> List[UserLibrary]:
        """Get most downloaded audiobooks for a user."""
        return self.db.query(UserLibrary).filter(
            UserLibrary.user_id == user_id
        ).order_by(desc(UserLibrary.download_count)).limit(limit).all()

    def add_to_library(
        self,
        user_id: UUID,
        audiobook_id: UUID,
        order_id: UUID
    ) -> UserLibrary:
        """Add an audiobook to user's library."""
        # Check if already in library
        existing = self.get_user_audiobook(user_id, audiobook_id)
        if existing:
            return existing

        library_data = {
            "user_id": user_id,
            "audiobook_id": audiobook_id,
            "order_id": order_id,
            "download_count": 0
        }
        return self.create(library_data)

    def increment_download_count(self, user_id: UUID, audiobook_id: UUID) -> Optional[UserLibrary]:
        """Increment download count for an audiobook."""
        library_item = self.get_user_audiobook(user_id, audiobook_id)
        if library_item:
            from sqlalchemy.sql import func
            return self.update(library_item, {
                "download_count": library_item.download_count + 1,
                "last_downloaded_at": func.now()
            })
        return None

    def has_audiobook(self, user_id: UUID, audiobook_id: UUID) -> bool:
        """Check if user has an audiobook in their library."""
        return self.get_user_audiobook(user_id, audiobook_id) is not None

    def get_library_stats(self, user_id: UUID) -> dict:
        """Get library statistics for a user."""
        library_items = self.get_user_library(user_id)
        
        total_audiobooks = len(library_items)
        total_downloads = sum(item.download_count for item in library_items)
        
        return {
            "total_audiobooks": total_audiobooks,
            "total_downloads": total_downloads,
            "average_downloads_per_book": total_downloads / total_audiobooks if total_audiobooks > 0 else 0
        }
