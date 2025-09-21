from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import and_, desc

from app.models.audiobook import Audiobook, AudiobookCategory
from app.models.enums import AudiobookStatus
from .base import BaseRepository


class AudiobookRepository(BaseRepository[Audiobook]):
    """Repository for audiobook operations."""

    def __init__(self, db: Session):
        super().__init__(Audiobook, db)

    def get_by_slug(self, slug: str) -> Optional[Audiobook]:
        """Get audiobook by slug."""
        return self.get_by_field("slug", slug)

    def get_by_status(self, status: AudiobookStatus) -> List[Audiobook]:
        """Get audiobooks by status."""
        return self.get_multi_by_field("status", status)

    def get_published_audiobooks(self) -> List[Audiobook]:
        """Get all published audiobooks."""
        return self.get_by_status(AudiobookStatus.PUBLISHED)

    def get_by_author(self, author_name: str) -> List[Audiobook]:
        """Get audiobooks by author."""
        return self.get_multi_by_field("author_name", author_name)

    def get_by_narrator(self, narrator_name: str) -> List[Audiobook]:
        """Get audiobooks by narrator."""
        return self.get_multi_by_field("narrator_name", narrator_name)

    def get_by_price_range(self, min_price: int, max_price: int) -> List[Audiobook]:
        """Get audiobooks within price range (in cents)."""
        return self.db.query(Audiobook).filter(
            and_(
                Audiobook.price_cents >= min_price,
                Audiobook.price_cents <= max_price
            )
        ).all()

    def get_featured_audiobooks(self, limit: int = 10) -> List[Audiobook]:
        """Get featured audiobooks (published, ordered by creation date)."""
        return self.db.query(Audiobook).filter(
            Audiobook.status == AudiobookStatus.PUBLISHED
        ).order_by(desc(Audiobook.created_at)).limit(limit).all()

    def search_audiobooks(self, search_term: str) -> List[Audiobook]:
        """Search audiobooks by title, author, or narrator."""
        return self.search(search_term, ["title", "author_name", "narrator_name"])

    def get_audiobooks_by_category(self, category_id: UUID) -> List[Audiobook]:
        """Get audiobooks in a specific category."""
        return self.db.query(Audiobook).join(AudiobookCategory).filter(
            AudiobookCategory.category_id == category_id
        ).all()

    def add_category(self, audiobook_id: UUID, category_id: UUID) -> Optional[AudiobookCategory]:
        """Add a category to an audiobook."""
        audiobook_category = AudiobookCategory(
            audiobook_id=audiobook_id,
            category_id=category_id
        )
        self.db.add(audiobook_category)
        self.db.commit()
        self.db.refresh(audiobook_category)
        return audiobook_category

    def remove_category(self, audiobook_id: UUID, category_id: UUID) -> bool:
        """Remove a category from an audiobook."""
        audiobook_category = self.db.query(AudiobookCategory).filter(
            and_(
                AudiobookCategory.audiobook_id == audiobook_id,
                AudiobookCategory.category_id == category_id
            )
        ).first()
        
        if audiobook_category:
            self.db.delete(audiobook_category)
            self.db.commit()
            return True
        return False

    def get_categories(self, audiobook_id: UUID) -> List[AudiobookCategory]:
        """Get all categories for an audiobook."""
        return self.db.query(AudiobookCategory).filter(
            AudiobookCategory.audiobook_id == audiobook_id
        ).all()

    def create_audiobook(
        self,
        title: str,
        slug: str,
        author_name: str,
        price_cents: int,
        description: Optional[str] = None,
        narrator_name: Optional[str] = None,
        duration_seconds: Optional[int] = None,
        isbn: Optional[str] = None,
        cover_image_url: Optional[str] = None,
        sample_url: Optional[str] = None,
        language: str = "en"
    ) -> Audiobook:
        """Create a new audiobook."""
        audiobook_data = {
            "title": title,
            "slug": slug,
            "author_name": author_name,
            "price_cents": price_cents,
            "description": description,
            "narrator_name": narrator_name,
            "duration_seconds": duration_seconds,
            "isbn": isbn,
            "cover_image_url": cover_image_url,
            "sample_url": sample_url,
            "language": language,
            "status": AudiobookStatus.DRAFT
        }
        return self.create(audiobook_data)

    def publish_audiobook(self, audiobook_id: UUID) -> Optional[Audiobook]:
        """Publish an audiobook."""
        audiobook = self.get(audiobook_id)
        if audiobook:
            return self.update(audiobook, {"status": AudiobookStatus.PUBLISHED})
        return None

    def archive_audiobook(self, audiobook_id: UUID) -> Optional[Audiobook]:
        """Archive an audiobook."""
        audiobook = self.get(audiobook_id)
        if audiobook:
            return self.update(audiobook, {"status": AudiobookStatus.ARCHIVED})
        return None
