# backend/config.py
import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:root@localhost:3306/appdb"
    )
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")