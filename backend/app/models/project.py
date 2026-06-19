from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field


class Project(Document):
    title: str
    title_zh: str = ""
    slug: str
    description: str
    content: str  # Markdown body
    tech_stack: list[str] = []
    images: list[str] = []  # URLs/paths
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool = False
    sort_order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "projects"
        indexes = ["slug", "featured", "sort_order"]

    class Config:
        json_schema_extra = {
            "example": {
                "title": "My Project",
                "slug": "my-project",
                "description": "A brief description",
                "content": "Detailed markdown content...",
                "tech_stack": ["React", "FastAPI"],
                "featured": True,
            }
        }


class ProjectDocument(Project):
    pass
