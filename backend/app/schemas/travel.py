from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TravelPostCreate(BaseModel):
    title: str
    title_zh: str = ""
    slug: str
    location_name: str
    location_name_zh: str = ""
    latitude: float
    longitude: float
    date_visited: Optional[str] = None
    description: str = ""
    description_zh: str = ""
    content: str = ""
    content_zh: str = ""
    images: list[str] = []
    tags: list[str] = []
    featured: bool = False


class TravelPostUpdate(BaseModel):
    title: Optional[str] = None
    title_zh: Optional[str] = None
    slug: Optional[str] = None
    location_name: Optional[str] = None
    location_name_zh: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    date_visited: Optional[str] = None
    description: Optional[str] = None
    description_zh: Optional[str] = None
    content: Optional[str] = None
    content_zh: Optional[str] = None
    images: Optional[list[str]] = None
    tags: Optional[list[str]] = None
    featured: Optional[bool] = None


class TravelPostResponse(BaseModel):
    id: str
    title: str
    title_zh: str = ""
    slug: str
    location_name: str
    location_name_zh: str = ""
    latitude: float
    longitude: float
    date_visited: Optional[str] = None
    description: str
    description_zh: str = ""
    content: str
    content_zh: str = ""
    images: list[str]
    tags: list[str]
    featured: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
