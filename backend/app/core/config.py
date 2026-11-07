from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "Cyber Chakravyuh"
    VERSION: str = "0.1.0"
    
    # Render Port
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Database (MongoDB Atlas for Render)
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "cyber_chakravyuh"
    
    # AI / LLM (Groq API)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Threat Intel APIs
    VIRUSTOTAL_API_KEY: str = ""
    GOOGLE_SAFE_BROWSING_API_KEY: str = ""
    
    # Web3
    SEPOLIA_RPC_URL: str = ""
    WEB3_PRIVATE_KEY: str = ""
    CONTRACT_ADDRESS: str = ""
    
    # CORS (Local development + Vercel deployment)
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
