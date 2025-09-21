from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class UserProfileResponse(BaseModel):
    id: UUID
    clerk_user_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class ClerkUser(BaseModel):
    id: str
    email_addresses: list[dict]
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    image_url: Optional[str] = None
    public_metadata: Optional[dict] = None


class AuthResponse(BaseModel):
    user: UserProfileResponse
    is_admin: bool
