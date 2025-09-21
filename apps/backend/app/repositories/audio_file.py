from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.audio_file import AudioFile
from .base import BaseRepository


class AudioFileRepository(BaseRepository[AudioFile]):
    """Repository for audio file operations."""

    def __init__(self, db: Session):
        super().__init__(AudioFile, db)

    def get_by_audiobook(self, audiobook_id: UUID) -> List[AudioFile]:
        """Get all audio files for an audiobook."""
        return self.get_multi_by_field("audiobook_id", audiobook_id)

    def get_by_chapter(self, audiobook_id: UUID, chapter_number: int) -> Optional[AudioFile]:
        """Get audio file by audiobook and chapter number."""
        return self.db.query(AudioFile).filter(
            AudioFile.audiobook_id == audiobook_id,
            AudioFile.chapter_number == chapter_number
        ).first()

    def get_chapters_ordered(self, audiobook_id: UUID) -> List[AudioFile]:
        """Get audio files ordered by chapter number."""
        return self.db.query(AudioFile).filter(
            AudioFile.audiobook_id == audiobook_id
        ).order_by(AudioFile.chapter_number).all()

    def get_total_duration(self, audiobook_id: UUID) -> int:
        """Get total duration of all audio files for an audiobook."""
        result = self.db.query(AudioFile.duration_seconds).filter(
            AudioFile.audiobook_id == audiobook_id
        ).all()
        return sum(duration[0] for duration in result if duration[0])

    def create_audio_file(
        self,
        audiobook_id: UUID,
        file_url: str,
        chapter_number: Optional[int] = None,
        chapter_title: Optional[str] = None,
        file_size_bytes: Optional[int] = None,
        duration_seconds: Optional[int] = None,
        mime_type: Optional[str] = None,
        checksum: Optional[str] = None
    ) -> AudioFile:
        """Create a new audio file."""
        audio_file_data = {
            "audiobook_id": audiobook_id,
            "file_url": file_url,
            "chapter_number": chapter_number,
            "chapter_title": chapter_title,
            "file_size_bytes": file_size_bytes,
            "duration_seconds": duration_seconds,
            "mime_type": mime_type,
            "checksum": checksum
        }
        return self.create(audio_file_data)
