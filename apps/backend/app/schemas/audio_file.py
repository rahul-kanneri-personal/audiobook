from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class AudioFileBase(BaseModel):
    audiobook_id: UUID
    chapter_number: Optional[int] = None
    chapter_title: Optional[str] = None
    file_url: str
    file_size_bytes: Optional[int] = None
    duration_seconds: Optional[int] = None
    mime_type: Optional[str] = None
    checksum: Optional[str] = None


class AudioFileCreate(AudioFileBase):
    pass


class AudioFileUpdate(BaseModel):
    chapter_number: Optional[int] = None
    chapter_title: Optional[str] = None
    file_url: Optional[str] = None
    file_size_bytes: Optional[int] = None
    duration_seconds: Optional[int] = None
    mime_type: Optional[str] = None
    checksum: Optional[str] = None


class AudioFileResponse(AudioFileBase):
    id: UUID
    created_at: str

    class Config:
        from_attributes = True


class PreSignedUrlRequest(BaseModel):
    file_name: str
    file_type: str
    file_size: Optional[int] = None


class PreSignedUrlResponse(BaseModel):
    upload_url: str
    file_url: str
    expires_in: int
