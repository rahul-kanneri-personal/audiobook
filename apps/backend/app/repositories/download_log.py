from typing import List, Optional
from uuid import UUID
from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import desc, and_

from app.models.download_log import DownloadLog
from .base import BaseRepository


class DownloadLogRepository(BaseRepository[DownloadLog]):
    """Repository for download log operations."""

    def __init__(self, db: Session):
        super().__init__(DownloadLog, db)

    def get_user_downloads(self, user_id: UUID) -> List[DownloadLog]:
        """Get all downloads for a user."""
        return self.db.query(DownloadLog).filter(
            DownloadLog.user_id == user_id
        ).order_by(desc(DownloadLog.created_at)).all()

    def get_audiobook_downloads(self, audiobook_id: UUID) -> List[DownloadLog]:
        """Get all downloads for an audiobook."""
        return self.get_multi_by_field("audiobook_id", audiobook_id)

    def get_audio_file_downloads(self, audio_file_id: UUID) -> List[DownloadLog]:
        """Get all downloads for an audio file."""
        return self.get_multi_by_field("audio_file_id", audio_file_id)

    def get_recent_downloads(self, limit: int = 100) -> List[DownloadLog]:
        """Get recent downloads."""
        return self.db.query(DownloadLog).order_by(desc(DownloadLog.created_at)).limit(limit).all()

    def get_user_recent_downloads(self, user_id: UUID, limit: int = 20) -> List[DownloadLog]:
        """Get recent downloads for a user."""
        return self.db.query(DownloadLog).filter(
            DownloadLog.user_id == user_id
        ).order_by(desc(DownloadLog.created_at)).limit(limit).all()

    def get_downloads_by_date_range(
        self, 
        start_date: datetime, 
        end_date: datetime
    ) -> List[DownloadLog]:
        """Get downloads within a date range."""
        return self.db.query(DownloadLog).filter(
            and_(
                DownloadLog.created_at >= start_date,
                DownloadLog.created_at <= end_date
            )
        ).all()

    def get_download_stats(self, audiobook_id: UUID) -> dict:
        """Get download statistics for an audiobook."""
        downloads = self.get_audiobook_downloads(audiobook_id)
        
        unique_users = set(download.user_id for download in downloads)
        total_downloads = len(downloads)
        
        return {
            "total_downloads": total_downloads,
            "unique_users": len(unique_users),
            "downloads_per_user": total_downloads / len(unique_users) if unique_users else 0
        }

    def create_download_log(
        self,
        user_id: UUID,
        audiobook_id: UUID,
        audio_file_id: Optional[UUID] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        download_url: Optional[str] = None,
        expires_at: Optional[datetime] = None
    ) -> DownloadLog:
        """Create a new download log entry."""
        download_log_data = {
            "user_id": user_id,
            "audiobook_id": audiobook_id,
            "audio_file_id": audio_file_id,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "download_url": download_url,
            "expires_at": expires_at
        }
        return self.create(download_log_data)

    def get_popular_audiobooks(self, limit: int = 10) -> List[dict]:
        """Get most downloaded audiobooks."""
        from sqlalchemy import func
        
        result = self.db.query(
            DownloadLog.audiobook_id,
            func.count(DownloadLog.id).label('download_count')
        ).group_by(DownloadLog.audiobook_id).order_by(
            func.count(DownloadLog.id).desc()
        ).limit(limit).all()
        
        return [
            {
                "audiobook_id": row[0],
                "download_count": row[1]
            }
            for row in result
        ]

    def get_user_download_summary(self, user_id: UUID) -> dict:
        """Get download summary for a user."""
        downloads = self.get_user_downloads(user_id)
        
        unique_audiobooks = set(download.audiobook_id for download in downloads)
        total_downloads = len(downloads)
        
        return {
            "total_downloads": total_downloads,
            "unique_audiobooks": len(unique_audiobooks),
            "downloads_per_audiobook": total_downloads / len(unique_audiobooks) if unique_audiobooks else 0
        }
