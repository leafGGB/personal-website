from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MessageCreate(BaseModel):
    name: str
    email: str
    message: str


class MessageResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True
