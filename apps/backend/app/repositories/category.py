from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.category import Category
from .base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    """Repository for category operations."""

    def __init__(self, db: Session):
        super().__init__(Category, db)

    def get_by_slug(self, slug: str) -> Optional[Category]:
        """Get category by slug."""
        return self.get_by_field("slug", slug)

    def get_active_categories(self) -> List[Category]:
        """Get all active categories."""
        return self.db.query(Category).filter(Category.is_active == True).all()

    def get_root_categories(self) -> List[Category]:
        """Get all root categories (no parent)."""
        return self.db.query(Category).filter(Category.parent_id.is_(None)).all()

    def get_child_categories(self, parent_id: UUID) -> List[Category]:
        """Get all child categories of a parent."""
        return self.get_multi_by_field("parent_id", parent_id)

    def get_category_tree(self, category_id: UUID) -> List[Category]:
        """Get the full category tree starting from a category."""
        categories = []
        category = self.get(category_id)
        
        if category:
            categories.append(category)
            # Get all children recursively
            children = self.get_child_categories(category_id)
            for child in children:
                categories.extend(self.get_category_tree(child.id))
        
        return categories

    def search_categories(self, search_term: str) -> List[Category]:
        """Search categories by name or description."""
        return self.search(search_term, ["name", "description"])

    def create_category(
        self,
        name: str,
        slug: str,
        description: Optional[str] = None,
        parent_id: Optional[UUID] = None,
        sort_order: int = 0
    ) -> Category:
        """Create a new category."""
        category_data = {
            "name": name,
            "slug": slug,
            "description": description,
            "parent_id": parent_id,
            "sort_order": sort_order,
            "is_active": True
        }
        return self.create(category_data)

    def toggle_active(self, category_id: UUID) -> Optional[Category]:
        """Toggle category active status."""
        category = self.get(category_id)
        if category:
            return self.update(category, {"is_active": not category.is_active})
        return None
