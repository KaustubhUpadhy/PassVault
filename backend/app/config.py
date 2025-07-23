from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Environment settings
    environment: str = os.getenv("ENVIRONMENT", "development")
    api_host: str = "0.0.0.0"
    api_port: int = int(os.getenv("PORT", 8000))  # Render uses PORT env var
    
    # CORS settings - updated for production
    cors_origins: List[str] = [
        "http://localhost:3000",  # Development
        "http://localhost:3001",  # Alternative dev port
    ]
    
    # API metadata
    api_title: str = "PassVault API"
    api_description: str = "Secure password management and analysis API"
    api_version: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Add production URLs based on environment
        if self.environment == "production":
            production_origins = [
                "https://your-frontend.vercel.app",  # UPDATE THIS with your actual Vercel URL
                "https://passvault.vercel.app",      # If you use a custom domain
                "https://passvault-frontend.vercel.app",  # Common Vercel naming
            ]
            self.cors_origins.extend(production_origins)
        
        # Remove duplicates
        self.cors_origins = list(set(self.cors_origins))

settings = Settings()