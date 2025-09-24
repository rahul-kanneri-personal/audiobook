from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import UserProfile
from app.models.enums import UserRole
from .base import BaseRepository


class UserRepository(BaseRepository[UserProfile]):
    """Repository for user profile operations."""

    def __init__(self, db: Session):
        super().__init__(UserProfile, db)

    def get_by_clerk_id(self, clerk_user_id: str) -> Optional[UserProfile]:
        """Get user by Clerk user ID."""
        return self.get_by_field("clerk_user_id", clerk_user_id)

    def get_by_email(self, email: str) -> Optional[UserProfile]:
        """Get user by email address."""
        return self.get_by_field("email", email)

    def get_by_role(self, role: UserRole) -> List[UserProfile]:
        """Get all users with a specific role."""
        return self.get_multi_by_field("role", role)

    def get_admins(self) -> List[UserProfile]:
        """Get all admin users."""
        return self.db.query(UserProfile).filter(
            UserProfile.role.in_([UserRole.ADMIN, UserRole.SUPER_ADMIN])
        ).all()

    def get_customers(self) -> List[UserProfile]:
        """Get all customer users."""
        return self.get_by_role(UserRole.CUSTOMER)

    def search_users(self, search_term: str) -> List[UserProfile]:
        """Search users by name or email."""
        return self.search(search_term, ["first_name", "last_name", "email"])

    def create_user_from_clerk(
        self, 
        clerk_user_id: str, 
        email: str, 
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        created_by: Optional[UUID] = None
    ) -> UserProfile:
        """Create a new user profile from Clerk data."""
        # Check if this is the first user - if so, make them admin
        total_users = self.db.query(UserProfile).count()
        role = UserRole.ADMIN if total_users == 0 else UserRole.CUSTOMER
        
        user_data = {
            "clerk_user_id": clerk_user_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "role": role,
            "avatar_url": avatar_url,
            "created_by": created_by  # Keep None for first user
        }
        return self.create(user_data)

    def update_role(self, user_id: UUID, new_role: UserRole) -> Optional[UserProfile]:
        """Update user role."""
        user = self.get(user_id)
        if user:
            return self.update(user, {"role": new_role})
        return None
