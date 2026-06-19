from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class TravelPost(Document):
    title: str
    title_zh: str = ""
    slug: str
    location_name: str
    location_name_zh: str = ""
    latitude: float
    longitude: float
    date_visited: Optional[str] = None  # e.g. "2025-08"
    description: str = ""
    description_zh: str = ""
    content: str = ""
    content_zh: str = ""
    images: list[str] = []
    tags: list[str] = []
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "travel_posts"
        indexes = ["slug", "featured", "location_name"]

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Kyoto in Autumn",
                "slug": "kyoto-autumn-2025",
                "location_name": "Kyoto, Japan",
                "latitude": 35.0116,
                "longitude": 135.7681,
                "date_visited": "2025-11",
                "description": "Chasing the autumn colours in the ancient capital.",
                "tags": ["Japan", "Autumn", "Travel"],
            }
        }
