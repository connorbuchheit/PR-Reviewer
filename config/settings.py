from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # OpenAI API Configuration
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4-turbo-preview"
    openai_temperature: float = 0.2
    openai_top_p: float = 0.95
    
    # Logging Configuration
    log_level: str = "INFO"
    logs_dir: str = "logs/sessions"
    
    # GitHub Configuration (for future use)
    github_token: Optional[str] = None
    github_api_url: str = "https://api.github.com"
    
    # Agent Configuration
    max_retrieval_docs: int = 10
    max_context_length: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings() 