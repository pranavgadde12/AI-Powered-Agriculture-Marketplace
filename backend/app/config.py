"""Configuration Management"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """All app settings loaded from environment"""
    
    # Supabase (Database)
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    
    # App Settings
    app_name: str = "AI Farm Adviser"
    app_version: str = "1.0.0"
    
    # API Server
    api_host: str = os.getenv("API_HOST", "127.0.0.1")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    
    # AI (OpenAI)
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS
    cors_origins: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

def validate_settings():
    """Check required settings are present"""
    if not settings.supabase_url:
        raise ValueError("❌ SUPABASE_URL not set in .env")
    if not settings.supabase_key:
        raise ValueError("❌ SUPABASE_KEY not set in .env")
    print("✅ All required settings loaded successfully")
