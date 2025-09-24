from typing import Optional
import httpx
import jwt
from jwt import PyJWKClient
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
        # Cache for JWKS client - will be initialized when needed
        self._jwks_clients = {}

    def _get_jwks_client(self, issuer: str) -> PyJWKClient:
        """Get or create JWKS client for the given issuer."""
        if issuer not in self._jwks_clients:
            jwks_url = f"{issuer}/.well-known/jwks.json"
            self._jwks_clients[issuer] = PyJWKClient(jwks_url)
        return self._jwks_clients[issuer]

    def verify_jwt_token(self, token: str) -> Optional[dict]:
        """Verify Clerk JWT token locally."""
        try:
            # Decode header to get issuer and key ID
            unverified_header = jwt.get_unverified_header(token)
            unverified_payload = jwt.decode(token, options={"verify_signature": False})
            
            issuer = unverified_payload.get("iss")
            if not issuer:
                print("No issuer found in token")
                return None
            
            # Get signing key from JWKS
            jwks_client = self._get_jwks_client(issuer)
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            
            # Verify and decode the token
            decoded_token = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                issuer=issuer,
                options={
                    "verify_exp": True,
                    "verify_iat": True,
                    "verify_nbf": True,
                }
            )
            
            return decoded_token
            
        except jwt.ExpiredSignatureError:
            print("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {e}")
            return None
        except Exception as e:
            print(f"Error verifying JWT token: {e}")
            return None

    async def verify_token(self, token: str) -> Optional[ClerkUser]:
        """Verify Clerk JWT token and return user data."""
        # First verify the JWT token locally
        decoded_token = self.verify_jwt_token(token)
        if not decoded_token:
            return None
        
        # Extract user ID from the token
        user_id = decoded_token.get("sub")
        if not user_id:
            print("No user ID found in token")
            return None
        
        try:
            # Get user details from Clerk API
            async with httpx.AsyncClient() as client:
                user_response = await client.get(
                    f"{self.base_url}/users/{user_id}",
                    headers={
                        "Authorization": f"Bearer {self.secret_key}",
                        "Content-Type": "application/json"
                    }
                )
                
                if user_response.status_code == 200:
                    return ClerkUser(**user_response.json())
                else:
                    print(f"Failed to get user from Clerk API: {user_response.status_code}")
                    return None
                    
        except Exception as e:
            print(f"Error getting user from Clerk API: {e}")
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
