from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class JournalPostCreate(BaseModel):
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


class JournalPostUpdate(BaseModel):
    title: Optional[str] = None
    title_zh: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    description_zh: Optional[str] = None
    content: Optional[str] = None
    content_zh: Optional[str] = None
    tags: Optional[list[str]] = None
    images: Optional[list[str]] = None
    featured: Optional[bool] = None


class JournalPostResponse(BaseModel):
    id: str
    title: str
    title_zh: str = ""
    slug: str
    description: str
    description_zh: str = ""
    content: str
    content_zh: str = ""
    tags: list[str]
    images: list[str]
    featured: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
