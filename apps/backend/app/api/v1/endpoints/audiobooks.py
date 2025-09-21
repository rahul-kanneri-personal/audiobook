from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.auth import get_current_admin_user, get_current_user_response
from app.models.user import UserProfile
from app.repositories.audiobook import AudiobookRepository
from app.repositories.category import CategoryRepository
from app.schemas.audiobook import AudiobookCreate, AudiobookUpdate, AudiobookResponse, AudiobookListResponse

router = APIRouter()


@router.post("/", response_model=AudiobookResponse, status_code=status.HTTP_201_CREATED)
async def create_audiobook(
    audiobook_data: AudiobookCreate,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Create a new audiobook (Admin only)."""
    audiobook_repo = AudiobookRepository(db)
    category_repo = CategoryRepository(db)
    
    # Check if slug already exists
    existing_audiobook = audiobook_repo.get_by_slug(audiobook_data.slug)
    if existing_audiobook:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audiobook with this slug already exists"
        )
    
    # Validate categories exist
    for category_id in audiobook_data.category_ids:
        category = category_repo.get(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with ID {category_id} not found"
            )
    
    # Create audiobook
    audiobook = audiobook_repo.create_audiobook(
        title=audiobook_data.title,
        slug=audiobook_data.slug,
        author_name=audiobook_data.author_name,
        price_cents=audiobook_data.price_cents,
        description=audiobook_data.description,
        narrator_name=audiobook_data.narrator_name,
        duration_seconds=audiobook_data.duration_seconds,
        isbn=audiobook_data.isbn,
        cover_image_url=audiobook_data.cover_image_url,
        sample_url=audiobook_data.sample_url,
        language=audiobook_data.language
    )
    
    # Add categories
    for category_id in audiobook_data.category_ids:
        audiobook_repo.add_category(audiobook.id, category_id)
    
    # Get categories for response
    categories = audiobook_repo.get_categories(audiobook.id)
    
    return AudiobookResponse(
        id=audiobook.id,
        title=audiobook.title,
        slug=audiobook.slug,
        isbn=audiobook.isbn,
        description=audiobook.description,
        ai_summary=audiobook.ai_summary,
        duration_seconds=audiobook.duration_seconds,
        price_cents=audiobook.price_cents,
        sample_url=audiobook.sample_url,
        cover_image_url=audiobook.cover_image_url,
        publication_date=audiobook.publication_date,
        language=audiobook.language,
        author_name=audiobook.author_name,
        narrator_name=audiobook.narrator_name,
        status=audiobook.status,
        created_at=audiobook.created_at.isoformat(),
        updated_at=audiobook.updated_at.isoformat(),
        categories=[{"id": cat.category_id, "name": cat.category.name} for cat in categories]
    )


@router.get("/public", response_model=AudiobookListResponse)
async def get_audiobooks_public(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    category_id: Optional[UUID] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search term"),
    db: Session = Depends(get_db)
):
    """Get audiobooks with pagination and filtering (public endpoint for development)."""
    audiobook_repo = AudiobookRepository(db)
    
    # Build filters - only show published audiobooks for public endpoint
    filters = {"status": "published"}
    if status_filter:
        filters["status"] = status_filter
    
    # Get audiobooks
    skip = (page - 1) * size
    
    if category_id:
        audiobooks = audiobook_repo.get_audiobooks_by_category(category_id)
        # Filter for published only
        audiobooks = [ab for ab in audiobooks if ab.status == "published"]
        total = len(audiobooks)
        audiobooks = audiobooks[skip:skip + size]
    elif search:
        audiobooks = audiobook_repo.search_audiobooks(search)
        # Filter for published only
        audiobooks = [ab for ab in audiobooks if ab.status == "published"]
        total = len(audiobooks)
        audiobooks = audiobooks[skip:skip + size]
    else:
        audiobooks = audiobook_repo.get_multi(skip=skip, limit=size, filters=filters)
        total = audiobook_repo.count(filters)
    
    # Build response
    audiobook_responses = []
    for audiobook in audiobooks:
        categories = audiobook_repo.get_categories(audiobook.id)
        audiobook_responses.append(AudiobookResponse(
            id=audiobook.id,
            title=audiobook.title,
            subtitle=audiobook.subtitle,
            author=audiobook.author,
            narrator=audiobook.narrator,
            description=audiobook.description,
            isbn=audiobook.isbn,
            language=audiobook.language,
            duration=audiobook.duration,
            file_size=audiobook.file_size,
            price=audiobook.price,
            currency=audiobook.currency,
            cover_image_url=audiobook.cover_image_url,
            sample_audio_url=audiobook.sample_audio_url,
            status=audiobook.status,
            slug=audiobook.slug,
            publisher=audiobook.publisher,
            publication_date=audiobook.publication_date,
            series_name=audiobook.series_name,
            series_number=audiobook.series_number,
            categories=[{"id": cat.id, "name": cat.name, "slug": cat.slug} for cat in categories],
            created_at=audiobook.created_at,
            updated_at=audiobook.updated_at
        ))
    
    return AudiobookListResponse(
        audiobooks=audiobook_responses,
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/", response_model=AudiobookListResponse)
async def get_audiobooks(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    category_id: Optional[UUID] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search term"),
    db: Session = Depends(get_db)
    # current_user: UserProfile = Depends(get_current_user_response)  # Temporarily disabled for testing
):
    """Get audiobooks with pagination and filtering."""
    audiobook_repo = AudiobookRepository(db)
    
    # Build filters
    filters = {}
    if status_filter:
        filters["status"] = status_filter
    
    # Get audiobooks
    skip = (page - 1) * size
    
    if category_id:
        audiobooks = audiobook_repo.get_audiobooks_by_category(category_id)
        total = len(audiobooks)
        audiobooks = audiobooks[skip:skip + size]
    elif search:
        audiobooks = audiobook_repo.search_audiobooks(search)
        total = len(audiobooks)
        audiobooks = audiobooks[skip:skip + size]
    else:
        audiobooks = audiobook_repo.get_multi(skip=skip, limit=size, filters=filters)
        total = audiobook_repo.count(filters)
    
    # Build response
    audiobook_responses = []
    for audiobook in audiobooks:
        categories = audiobook_repo.get_categories(audiobook.id)
        audiobook_responses.append(AudiobookResponse(
            id=audiobook.id,
            title=audiobook.title,
            slug=audiobook.slug,
            isbn=audiobook.isbn,
            description=audiobook.description,
            ai_summary=audiobook.ai_summary,
            duration_seconds=audiobook.duration_seconds,
            price_cents=audiobook.price_cents,
            sample_url=audiobook.sample_url,
            cover_image_url=audiobook.cover_image_url,
            publication_date=audiobook.publication_date,
            language=audiobook.language,
            author_name=audiobook.author_name,
            narrator_name=audiobook.narrator_name,
            status=audiobook.status,
            created_at=audiobook.created_at.isoformat(),
            updated_at=audiobook.updated_at.isoformat(),
            categories=[{"id": cat.category_id, "name": cat.category.name} for cat in categories]
        ))
    
    pages = (total + size - 1) // size
    
    return AudiobookListResponse(
        items=audiobook_responses,
        total=total,
        page=page,
        size=size,
        pages=pages
    )


@router.get("/{audiobook_id}", response_model=AudiobookResponse)
async def get_audiobook(
    audiobook_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user_response)
):
    """Get a specific audiobook."""
    audiobook_repo = AudiobookRepository(db)
    audiobook = audiobook_repo.get(audiobook_id)
    
    if not audiobook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audiobook not found"
        )
    
    categories = audiobook_repo.get_categories(audiobook.id)
    
    return AudiobookResponse(
        id=audiobook.id,
        title=audiobook.title,
        slug=audiobook.slug,
        isbn=audiobook.isbn,
        description=audiobook.description,
        ai_summary=audiobook.ai_summary,
        duration_seconds=audiobook.duration_seconds,
        price_cents=audiobook.price_cents,
        sample_url=audiobook.sample_url,
        cover_image_url=audiobook.cover_image_url,
        publication_date=audiobook.publication_date,
        language=audiobook.language,
        author_name=audiobook.author_name,
        narrator_name=audiobook.narrator_name,
        status=audiobook.status,
        created_at=audiobook.created_at.isoformat(),
        updated_at=audiobook.updated_at.isoformat(),
        categories=[{"id": cat.category_id, "name": cat.category.name} for cat in categories]
    )


@router.put("/{audiobook_id}", response_model=AudiobookResponse)
async def update_audiobook(
    audiobook_id: UUID,
    audiobook_data: AudiobookUpdate,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Update an audiobook (Admin only)."""
    audiobook_repo = AudiobookRepository(db)
    category_repo = CategoryRepository(db)
    audiobook = audiobook_repo.get(audiobook_id)
    
    if not audiobook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audiobook not found"
        )
    
    # Check if slug already exists (excluding current audiobook)
    if audiobook_data.slug and audiobook_data.slug != audiobook.slug:
        existing_audiobook = audiobook_repo.get_by_slug(audiobook_data.slug)
        if existing_audiobook:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Audiobook with this slug already exists"
            )
    
    # Validate categories exist if provided
    if audiobook_data.category_ids:
        for category_id in audiobook_data.category_ids:
            category = category_repo.get(category_id)
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with ID {category_id} not found"
                )
    
    # Update audiobook
    update_data = audiobook_data.model_dump(exclude_unset=True, exclude={"category_ids"})
    updated_audiobook = audiobook_repo.update(audiobook, update_data)
    
    # Update categories if provided
    if audiobook_data.category_ids is not None:
        # Remove existing categories
        existing_categories = audiobook_repo.get_categories(audiobook_id)
        for cat in existing_categories:
            audiobook_repo.remove_category(audiobook_id, cat.category_id)
        
        # Add new categories
        for category_id in audiobook_data.category_ids:
            audiobook_repo.add_category(audiobook_id, category_id)
    
    # Get updated categories
    categories = audiobook_repo.get_categories(audiobook_id)
    
    return AudiobookResponse(
        id=updated_audiobook.id,
        title=updated_audiobook.title,
        slug=updated_audiobook.slug,
        isbn=updated_audiobook.isbn,
        description=updated_audiobook.description,
        ai_summary=updated_audiobook.ai_summary,
        duration_seconds=updated_audiobook.duration_seconds,
        price_cents=updated_audiobook.price_cents,
        sample_url=updated_audiobook.sample_url,
        cover_image_url=updated_audiobook.cover_image_url,
        publication_date=updated_audiobook.publication_date,
        language=updated_audiobook.language,
        author_name=updated_audiobook.author_name,
        narrator_name=updated_audiobook.narrator_name,
        status=updated_audiobook.status,
        created_at=updated_audiobook.created_at.isoformat(),
        updated_at=updated_audiobook.updated_at.isoformat(),
        categories=[{"id": cat.category_id, "name": cat.category.name} for cat in categories]
    )


@router.post("/{audiobook_id}/publish", response_model=AudiobookResponse)
async def publish_audiobook(
    audiobook_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Publish an audiobook (Admin only)."""
    audiobook_repo = AudiobookRepository(db)
    audiobook = audiobook_repo.publish_audiobook(audiobook_id)
    
    if not audiobook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audiobook not found"
        )
    
    categories = audiobook_repo.get_categories(audiobook_id)
    
    return AudiobookResponse(
        id=audiobook.id,
        title=audiobook.title,
        slug=audiobook.slug,
        isbn=audiobook.isbn,
        description=audiobook.description,
        ai_summary=audiobook.ai_summary,
        duration_seconds=audiobook.duration_seconds,
        price_cents=audiobook.price_cents,
        sample_url=audiobook.sample_url,
        cover_image_url=audiobook.cover_image_url,
        publication_date=audiobook.publication_date,
        language=audiobook.language,
        author_name=audiobook.author_name,
        narrator_name=audiobook.narrator_name,
        status=audiobook.status,
        created_at=audiobook.created_at.isoformat(),
        updated_at=audiobook.updated_at.isoformat(),
        categories=[{"id": cat.category_id, "name": cat.category.name} for cat in categories]
    )


@router.delete("/{audiobook_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audiobook(
    audiobook_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Delete an audiobook (Admin only)."""
    audiobook_repo = AudiobookRepository(db)
    audiobook = audiobook_repo.get(audiobook_id)
    
    if not audiobook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audiobook not found"
        )
    
    audiobook_repo.delete(audiobook_id)
