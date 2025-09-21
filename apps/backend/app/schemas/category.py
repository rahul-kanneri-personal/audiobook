from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    sort_order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    id: UUID
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class CategoryTreeResponse(CategoryResponse):
    children: List['CategoryTreeResponse'] = []

    class Config:
        from_attributes = True


# Update forward references
CategoryTreeResponse.model_rebuild()
