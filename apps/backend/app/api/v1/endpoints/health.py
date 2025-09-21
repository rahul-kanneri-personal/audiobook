from datetime import datetime, timezone
from typing import Dict

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check() -> Dict[str, str]:
    """Health check endpoint to verify the API is running."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "audiobook-api",
    }
