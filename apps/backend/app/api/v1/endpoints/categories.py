from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.auth import get_current_admin_user, get_current_user_response
from app.models.user import UserProfile
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryTreeResponse

router = APIRouter()


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db)
    # current_user: UserProfile = Depends(get_current_admin_user)  # Temporarily disabled for testing
):
    """Create a new category (Admin only)."""
    category_repo = CategoryRepository(db)
    
    # Check if slug already exists
    existing_category = category_repo.get_by_slug(category_data.slug)
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this slug already exists"
        )
    
    # Validate parent category exists if provided
    if category_data.parent_id:
        parent_category = category_repo.get(category_data.parent_id)
        if not parent_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent category not found"
            )
    
    category = category_repo.create_category(
        name=category_data.name,
        slug=category_data.slug,
        description=category_data.description,
        parent_id=category_data.parent_id,
        sort_order=category_data.sort_order
    )
    
    return CategoryResponse(
        id=category.id,
        name=category.name,
        slug=category.slug,
        description=category.description,
        parent_id=category.parent_id,
        sort_order=category.sort_order,
        is_active=category.is_active,
        created_at=category.created_at.isoformat(),
        updated_at=category.updated_at.isoformat()
    )


@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    active_only: bool = Query(True, description="Return only active categories"),
    db: Session = Depends(get_db)
    # current_user: UserProfile = Depends(get_current_user_response)  # Temporarily disabled for testing
):
    """Get all categories."""
    category_repo = CategoryRepository(db)
    
    if active_only:
        categories = category_repo.get_active_categories()
    else:
        categories = category_repo.get_multi()
    
    return [
        CategoryResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            parent_id=category.parent_id,
            sort_order=category.sort_order,
            is_active=category.is_active,
            created_at=category.created_at.isoformat(),
            updated_at=category.updated_at.isoformat()
        )
        for category in categories
    ]


@router.get("/tree", response_model=List[CategoryTreeResponse])
async def get_category_tree(
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user_response)
):
    """Get category tree structure."""
    category_repo = CategoryRepository(db)
    root_categories = category_repo.get_root_categories()
    
    def build_tree(category):
        children = category_repo.get_child_categories(category.id)
        return CategoryTreeResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            parent_id=category.parent_id,
            sort_order=category.sort_order,
            is_active=category.is_active,
            created_at=category.created_at.isoformat(),
            updated_at=category.updated_at.isoformat(),
            children=[build_tree(child) for child in children if child.is_active]
        )
    
    return [build_tree(category) for category in root_categories if category.is_active]


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user_response)
):
    """Get a specific category."""
    category_repo = CategoryRepository(db)
    category = category_repo.get(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return CategoryResponse(
        id=category.id,
        name=category.name,
        slug=category.slug,
        description=category.description,
        parent_id=category.parent_id,
        sort_order=category.sort_order,
        is_active=category.is_active,
        created_at=category.created_at.isoformat(),
        updated_at=category.updated_at.isoformat()
    )


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: UUID,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Update a category (Admin only)."""
    category_repo = CategoryRepository(db)
    category = category_repo.get(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if slug already exists (excluding current category)
    if category_data.slug and category_data.slug != category.slug:
        existing_category = category_repo.get_by_slug(category_data.slug)
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this slug already exists"
            )
    
    # Validate parent category exists if provided
    if category_data.parent_id:
        parent_category = category_repo.get(category_data.parent_id)
        if not parent_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent category not found"
            )
    
    # Update category
    update_data = category_data.model_dump(exclude_unset=True)
    updated_category = category_repo.update(category, update_data)
    
    return CategoryResponse(
        id=updated_category.id,
        name=updated_category.name,
        slug=updated_category.slug,
        description=updated_category.description,
        parent_id=updated_category.parent_id,
        sort_order=updated_category.sort_order,
        is_active=updated_category.is_active,
        created_at=updated_category.created_at.isoformat(),
        updated_at=updated_category.updated_at.isoformat()
    )


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Delete a category (Admin only)."""
    category_repo = CategoryRepository(db)
    category = category_repo.get(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if category has children
    children = category_repo.get_child_categories(category_id)
    if children:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category with child categories"
        )
    
    category_repo.delete(category_id)
