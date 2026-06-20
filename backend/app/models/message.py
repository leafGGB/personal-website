from datetime import datetime
from beanie import Document
from pydantic import Field


class Message(Document):
    name: str
    email: str
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "messages"
        indexes = ["email", "read"]
