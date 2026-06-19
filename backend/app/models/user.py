from datetime import datetime
from beanie import Document
from pydantic import Field


class User(Document):
    email: str
    hashed_password: str
    name: str = "Admin"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        indexes = ["email"]
