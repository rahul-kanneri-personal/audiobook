from typing import Optional
import httpx
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import UserProfile
from app.models.enums import UserRole
from app.repositories.user import UserRepository
from app.schemas.auth import UserProfileResponse, ClerkUser
from app.core.config import settings

security = HTTPBearer()


class ClerkAuth:
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
        self.base_url = "https://api.clerk.com/v1"

    async def verify_token(self, token: str) -> Optional[ClerkUser]:
        """Verify Clerk JWT token and return user data."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/sessions/{token}/verify",
                    headers={
                        "Authorization": f"Bearer {self.secret_key}",
                        "Content-Type": "application/json"
                    }
                )
                
                if response.status_code == 200:
                    session_data = response.json()
                    user_id = session_data.get("user_id")
                    
                    if user_id:
                        # Get user details
                        user_response = await client.get(
                            f"{self.base_url}/users/{user_id}",
                            headers={
                                "Authorization": f"Bearer {self.secret_key}",
                                "Content-Type": "application/json"
                            }
                        )
                        
                        if user_response.status_code == 200:
                            return ClerkUser(**user_response.json())
                
                return None
                
        except Exception as e:
            print(f"Error verifying Clerk token: {e}")
            return None

    async def get_user_from_token(self, token: str, db: Session) -> Optional[UserProfile]:
        """Get user profile from Clerk token."""
        clerk_user = await self.verify_token(token)
        if not clerk_user:
            return None

        user_repo = UserRepository(db)
        
        # Try to get existing user
        user = user_repo.get_by_clerk_id(clerk_user.id)
        
        if not user:
            # Create new user if doesn't exist
            email = clerk_user.email_addresses[0]["email_address"] if clerk_user.email_addresses else ""
            user = user_repo.create_user_from_clerk(
                clerk_user_id=clerk_user.id,
                email=email,
                first_name=clerk_user.first_name,
                last_name=clerk_user.last_name,
                avatar_url=clerk_user.image_url
            )
        
        return user


# Initialize Clerk auth
clerk_auth = ClerkAuth(settings.CLERK_SECRET_KEY)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> UserProfile:
    """Get current authenticated user."""
    token = credentials.credentials
    
    user = await clerk_auth.get_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


async def get_current_admin_user(
    current_user: UserProfile = Depends(get_current_user)
) -> UserProfile:
    """Get current authenticated admin user."""
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user


def get_current_user_response(
    current_user: UserProfile = Depends(get_current_user)
) -> UserProfileResponse:
    """Get current user as response model."""
    return UserProfileResponse(
        id=current_user.id,
        clerk_user_id=current_user.clerk_user_id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        role=current_user.role,
        avatar_url=current_user.avatar_url
    )
