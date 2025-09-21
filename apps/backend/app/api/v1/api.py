from fastapi import APIRouter

from app.api.v1.endpoints import health, categories, audiobooks, audio_files

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(audiobooks.router, prefix="/audiobooks", tags=["audiobooks"])
api_router.include_router(audio_files.router, prefix="/audio-files", tags=["audio-files"])
