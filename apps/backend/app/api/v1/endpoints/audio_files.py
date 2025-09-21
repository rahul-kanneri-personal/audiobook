from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.auth import get_current_admin_user, get_current_user_response
from app.core.spaces import spaces_client
from app.models.user import UserProfile
from app.repositories.audio_file import AudioFileRepository
from app.repositories.audiobook import AudiobookRepository
from app.schemas.audio_file import (
    AudioFileCreate, 
    AudioFileUpdate, 
    AudioFileResponse,
    PreSignedUrlRequest,
    PreSignedUrlResponse
)

router = APIRouter()


@router.post("/presigned-url", response_model=PreSignedUrlResponse)
async def get_presigned_url(
    request: PreSignedUrlRequest,
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Generate presigned URL for file upload (Admin only)."""
    try:
        # Determine folder based on file type
        folder = "audio-files"
        if request.file_type.startswith("image/"):
            folder = "images"
        elif request.file_type.startswith("audio/"):
            folder = "audio-files"
        
        result = spaces_client.generate_presigned_url(
            file_name=request.file_name,
            file_type=request.file_type,
            folder=folder
        )
        
        return PreSignedUrlResponse(
            upload_url=result["upload_url"],
            file_url=result["file_url"],
            expires_in=result["expires_in"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating presigned URL: {str(e)}"
        )


@router.post("/", response_model=AudioFileResponse, status_code=status.HTTP_201_CREATED)
async def create_audio_file(
    audio_file_data: AudioFileCreate,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Create a new audio file (Admin only)."""
    audio_file_repo = AudioFileRepository(db)
    audiobook_repo = AudiobookRepository(db)
    
    # Validate audiobook exists
    audiobook = audiobook_repo.get(audio_file_data.audiobook_id)
    if not audiobook:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audiobook not found"
        )
    
    # Check if chapter number already exists for this audiobook
    if audio_file_data.chapter_number:
        existing_file = audio_file_repo.get_by_chapter(
            audio_file_data.audiobook_id, 
            audio_file_data.chapter_number
        )
        if existing_file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Chapter number already exists for this audiobook"
            )
    
    audio_file = audio_file_repo.create_audio_file(
        audiobook_id=audio_file_data.audiobook_id,
        file_url=audio_file_data.file_url,
        chapter_number=audio_file_data.chapter_number,
        chapter_title=audio_file_data.chapter_title,
        file_size_bytes=audio_file_data.file_size_bytes,
        duration_seconds=audio_file_data.duration_seconds,
        mime_type=audio_file_data.mime_type,
        checksum=audio_file_data.checksum
    )
    
    return AudioFileResponse(
        id=audio_file.id,
        audiobook_id=audio_file.audiobook_id,
        chapter_number=audio_file.chapter_number,
        chapter_title=audio_file.chapter_title,
        file_url=audio_file.file_url,
        file_size_bytes=audio_file.file_size_bytes,
        duration_seconds=audio_file.duration_seconds,
        mime_type=audio_file.mime_type,
        checksum=audio_file.checksum,
        created_at=audio_file.created_at.isoformat()
    )


@router.get("/audiobook/{audiobook_id}", response_model=List[AudioFileResponse])
async def get_audiobook_files(
    audiobook_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user_response)
):
    """Get all audio files for an audiobook."""
    audio_file_repo = AudioFileRepository(db)
    audiobook_repo = AudiobookRepository(db)
    
    # Validate audiobook exists
    audiobook = audiobook_repo.get(audiobook_id)
    if not audiobook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audiobook not found"
        )
    
    audio_files = audio_file_repo.get_chapters_ordered(audiobook_id)
    
    return [
        AudioFileResponse(
            id=audio_file.id,
            audiobook_id=audio_file.audiobook_id,
            chapter_number=audio_file.chapter_number,
            chapter_title=audio_file.chapter_title,
            file_url=audio_file.file_url,
            file_size_bytes=audio_file.file_size_bytes,
            duration_seconds=audio_file.duration_seconds,
            mime_type=audio_file.mime_type,
            checksum=audio_file.checksum,
            created_at=audio_file.created_at.isoformat()
        )
        for audio_file in audio_files
    ]


@router.get("/{audio_file_id}", response_model=AudioFileResponse)
async def get_audio_file(
    audio_file_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user_response)
):
    """Get a specific audio file."""
    audio_file_repo = AudioFileRepository(db)
    audio_file = audio_file_repo.get(audio_file_id)
    
    if not audio_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    return AudioFileResponse(
        id=audio_file.id,
        audiobook_id=audio_file.audiobook_id,
        chapter_number=audio_file.chapter_number,
        chapter_title=audio_file.chapter_title,
        file_url=audio_file.file_url,
        file_size_bytes=audio_file.file_size_bytes,
        duration_seconds=audio_file.duration_seconds,
        mime_type=audio_file.mime_type,
        checksum=audio_file.checksum,
        created_at=audio_file.created_at.isoformat()
    )


@router.put("/{audio_file_id}", response_model=AudioFileResponse)
async def update_audio_file(
    audio_file_id: UUID,
    audio_file_data: AudioFileUpdate,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Update an audio file (Admin only)."""
    audio_file_repo = AudioFileRepository(db)
    audio_file = audio_file_repo.get(audio_file_id)
    
    if not audio_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    # Check if chapter number already exists for this audiobook (excluding current file)
    if audio_file_data.chapter_number and audio_file_data.chapter_number != audio_file.chapter_number:
        existing_file = audio_file_repo.get_by_chapter(
            audio_file.audiobook_id, 
            audio_file_data.chapter_number
        )
        if existing_file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Chapter number already exists for this audiobook"
            )
    
    # Update audio file
    update_data = audio_file_data.model_dump(exclude_unset=True)
    updated_audio_file = audio_file_repo.update(audio_file, update_data)
    
    return AudioFileResponse(
        id=updated_audio_file.id,
        audiobook_id=updated_audio_file.audiobook_id,
        chapter_number=updated_audio_file.chapter_number,
        chapter_title=updated_audio_file.chapter_title,
        file_url=updated_audio_file.file_url,
        file_size_bytes=updated_audio_file.file_size_bytes,
        duration_seconds=updated_audio_file.duration_seconds,
        mime_type=updated_audio_file.mime_type,
        checksum=updated_audio_file.checksum,
        created_at=updated_audio_file.created_at.isoformat()
    )


@router.delete("/{audio_file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audio_file(
    audio_file_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Delete an audio file (Admin only)."""
    audio_file_repo = AudioFileRepository(db)
    audio_file = audio_file_repo.get(audio_file_id)
    
    if not audio_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    # Extract object key from file URL for deletion from Spaces
    try:
        # Assuming file_url format: https://cdn.example.com/folder/filename.ext
        # Extract the path after the domain
        file_url = audio_file.file_url
        if "/" in file_url:
            object_key = "/".join(file_url.split("/")[3:])  # Remove domain part
            spaces_client.delete_file(object_key)
    except Exception as e:
        print(f"Error deleting file from Spaces: {e}")
        # Continue with database deletion even if Spaces deletion fails
    
    audio_file_repo.delete(audio_file_id)
