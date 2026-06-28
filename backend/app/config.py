from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "personal_website"

    # JWT
    jwt_secret: str = "5tUGbsdwRxWjSyvHmp1gkzoa0ercJKVX6hE2OPMY3l8Q97TL"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    # Server
    app_name: str = "Personal Website API"
    cors_origins: list[str] = ["http://localhost:5173"]
    upload_dir: str = "uploads"

    # Admin seed
    admin_email: str = "admin@example.com"
    # Must be set via ADMIN_PASSWORD env var; empty default forces .env requirement
    admin_password: str = ""

    class Config:
        env_file = ".env"


settings = Settings()