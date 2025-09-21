from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import desc, and_

from app.models.review import Review
from .base import BaseRepository


class ReviewRepository(BaseRepository[Review]):
    """Repository for review operations."""

    def __init__(self, db: Session):
        super().__init__(Review, db)

    def get_by_audiobook(self, audiobook_id: UUID) -> List[Review]:
        """Get all reviews for an audiobook."""
        return self.get_multi_by_field("audiobook_id", audiobook_id)

    def get_by_user(self, user_id: UUID) -> List[Review]:
        """Get all reviews by a user."""
        return self.get_multi_by_field("user_id", user_id)

    def get_by_rating(self, rating: int) -> List[Review]:
        """Get reviews by rating."""
        return self.get_multi_by_field("rating", rating)

    def get_user_review_for_audiobook(self, user_id: UUID, audiobook_id: UUID) -> Optional[Review]:
        """Get a user's review for a specific audiobook."""
        return self.db.query(Review).filter(
            and_(
                Review.user_id == user_id,
                Review.audiobook_id == audiobook_id
            )
        ).first()

    def get_verified_reviews(self, audiobook_id: UUID) -> List[Review]:
        """Get verified purchase reviews for an audiobook."""
        return self.db.query(Review).filter(
            and_(
                Review.audiobook_id == audiobook_id,
                Review.is_verified_purchase == True
            )
        ).all()

    def get_recent_reviews(self, audiobook_id: UUID, limit: int = 10) -> List[Review]:
        """Get recent reviews for an audiobook."""
        return self.db.query(Review).filter(
            Review.audiobook_id == audiobook_id
        ).order_by(desc(Review.created_at)).limit(limit).all()

    def get_high_rated_reviews(self, audiobook_id: UUID, min_rating: int = 4) -> List[Review]:
        """Get high-rated reviews for an audiobook."""
        return self.db.query(Review).filter(
            and_(
                Review.audiobook_id == audiobook_id,
                Review.rating >= min_rating
            )
        ).all()

    def get_average_rating(self, audiobook_id: UUID) -> Optional[float]:
        """Get average rating for an audiobook."""
        result = self.db.query(Review.rating).filter(
            Review.audiobook_id == audiobook_id
        ).all()
        
        if result:
            ratings = [r[0] for r in result]
            return sum(ratings) / len(ratings)
        return None

    def get_rating_distribution(self, audiobook_id: UUID) -> dict:
        """Get rating distribution for an audiobook."""
        result = self.db.query(Review.rating).filter(
            Review.audiobook_id == audiobook_id
        ).all()
        
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for rating_tuple in result:
            rating = rating_tuple[0]
            if rating in distribution:
                distribution[rating] += 1
        
        return distribution

    def create_review(
        self,
        audiobook_id: UUID,
        user_id: UUID,
        rating: int,
        title: Optional[str] = None,
        content: Optional[str] = None,
        is_verified_purchase: bool = False
    ) -> Review:
        """Create a new review."""
        review_data = {
            "audiobook_id": audiobook_id,
            "user_id": user_id,
            "rating": rating,
            "title": title,
            "content": content,
            "is_verified_purchase": is_verified_purchase,
            "helpful_count": 0
        }
        return self.create(review_data)

    def increment_helpful_count(self, review_id: UUID) -> Optional[Review]:
        """Increment helpful count for a review."""
        review = self.get(review_id)
        if review:
            return self.update(review, {"helpful_count": review.helpful_count + 1})
        return None
