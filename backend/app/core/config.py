from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    # ... existing settings ...
    
    # Ollama settings
    OLLAMA_API_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
