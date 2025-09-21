from typing import Optional, List
from uuid import UUID
from datetime import date
from pydantic import BaseModel


class AudiobookBase(BaseModel):
    title: str
    slug: str
    isbn: Optional[str] = None
    description: Optional[str] = None
    ai_summary: Optional[str] = None
    duration_seconds: Optional[int] = None
    price_cents: int
    sample_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    publication_date: Optional[date] = None
    language: str = "en"
    author_name: str
    narrator_name: Optional[str] = None


class AudiobookCreate(AudiobookBase):
    category_ids: List[UUID] = []


class AudiobookUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    isbn: Optional[str] = None
    description: Optional[str] = None
    ai_summary: Optional[str] = None
    duration_seconds: Optional[int] = None
    price_cents: Optional[int] = None
    sample_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    publication_date: Optional[date] = None
    language: Optional[str] = None
    author_name: Optional[str] = None
    narrator_name: Optional[str] = None
    status: Optional[str] = None
    category_ids: Optional[List[UUID]] = None


class AudiobookResponse(AudiobookBase):
    id: UUID
    status: str
    created_at: str
    updated_at: str
    categories: List[dict] = []

    class Config:
        from_attributes = True


class AudiobookListResponse(BaseModel):
    items: List[AudiobookResponse]
    total: int
    page: int
    size: int
    pages: int
