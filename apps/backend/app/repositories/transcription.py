from typing import List, Optional
from uuid import UUID
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.transcription import Transcription
from app.models.enums import TranscriptionStatus, JobStatus
from .base import BaseRepository


class TranscriptionRepository(BaseRepository[Transcription]):
    """Repository for transcription operations."""

    def __init__(self, db: Session):
        super().__init__(Transcription, db)

    def get_by_audio_file(self, audio_file_id: UUID) -> List[Transcription]:
        """Get transcriptions for an audio file."""
        return self.get_multi_by_field("audio_file_id", audio_file_id)

    def get_by_status(self, status: TranscriptionStatus) -> List[Transcription]:
        """Get transcriptions by status."""
        return self.get_multi_by_field("status", status)

    def get_by_job_status(self, job_status: JobStatus) -> List[Transcription]:
        """Get transcriptions by job status."""
        return self.get_multi_by_field("job_status", job_status)

    def get_pending_transcriptions(self) -> List[Transcription]:
        """Get all pending transcriptions."""
        return self.get_by_status(TranscriptionStatus.PENDING)

    def get_failed_transcriptions(self) -> List[Transcription]:
        """Get all failed transcriptions."""
        return self.get_by_status(TranscriptionStatus.FAILED)

    def get_completed_transcriptions(self) -> List[Transcription]:
        """Get all completed transcriptions."""
        return self.get_by_status(TranscriptionStatus.COMPLETED)

    def create_transcription(
        self,
        audio_file_id: UUID,
        content: str,
        confidence_score: Optional[Decimal] = None,
        ai_service: Optional[str] = None,
        status: TranscriptionStatus = TranscriptionStatus.PENDING,
        job_status: JobStatus = JobStatus.PENDING
    ) -> Transcription:
        """Create a new transcription."""
        transcription_data = {
            "audio_file_id": audio_file_id,
            "content": content,
            "confidence_score": confidence_score,
            "ai_service": ai_service,
            "status": status,
            "job_status": job_status,
            "upload_progress": 0
        }
        return self.create(transcription_data)

    def update_status(
        self, 
        transcription_id: UUID, 
        status: TranscriptionStatus,
        error_message: Optional[str] = None
    ) -> Optional[Transcription]:
        """Update transcription status."""
        transcription = self.get(transcription_id)
        if transcription:
            update_data = {"status": status}
            if error_message:
                update_data["error_message"] = error_message
            if status == TranscriptionStatus.COMPLETED:
                from sqlalchemy.sql import func
                update_data["processed_at"] = func.now()
            return self.update(transcription, update_data)
        return None

    def update_progress(self, transcription_id: UUID, progress: int) -> Optional[Transcription]:
        """Update upload progress."""
        transcription = self.get(transcription_id)
        if transcription:
            return self.update(transcription, {"upload_progress": progress})
        return None
