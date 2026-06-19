from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import init_db
from app.api import auth, journal, projects, travel
from app.models.user import User
from app.core.security import hash_password
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()

    # Seed admin user
    admin = await User.find_one(User.email == settings.admin_email)
    if not admin:
        admin = User(
            email=settings.admin_email,
            hashed_password=hash_password(settings.admin_password),
            name="Admin",
        )
        await admin.insert()

    # Ensure upload dir exists
    os.makedirs(settings.upload_dir, exist_ok=True)

    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(auth.router)
app.include_router(journal.router)
app.include_router(projects.router)
app.include_router(travel.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
