from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    title: str
    title_zh: str = ""
    slug: str
    description: str
    content: str = ""
    tech_stack: list[str] = []
    images: list[str] = []
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool = False
    sort_order: int = 0


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    title_zh: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    tech_stack: Optional[list[str]] = None
    images: Optional[list[str]] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: Optional[bool] = None
    sort_order: Optional[int] = None


class ProjectResponse(BaseModel):
    id: str
    title: str
    title_zh: str = ""
    slug: str
    description: str
    content: str
    tech_stack: list[str]
    images: list[str]
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
