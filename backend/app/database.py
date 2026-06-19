from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models.journal import JournalPost
from app.models.project import Project
from app.models.travel import TravelPost
from app.models.user import User


async def init_db():
    client = AsyncIOMotorClient(settings.mongodb_uri)
    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[JournalPost, Project, TravelPost, User],
    )
    return client
