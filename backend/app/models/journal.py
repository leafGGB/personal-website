from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class JournalPost(Document):
    title: str
    title_zh: str = ""
    slug: str
    description: str = ""
    description_zh: str = ""
    content: str = ""
    content_zh: str = ""
    tags: list[str] = []
    images: list[str] = []
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "journal_posts"
        indexes = ["slug", "featured", "created_at"]

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Why I Love Building Things",
                "slug": "why-i-love-building",
                "description": "Reflections on creativity and craft.",
                "tags": ["Thoughts", "Philosophy"],
            }
        }
