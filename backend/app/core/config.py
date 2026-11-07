from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
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
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    
    # Threat Intel APIs
    VIRUSTOTAL_API_KEY: str = ""
    SHODAN_API_KEY: str = ""
    
    # Web3
    SEPOLIA_RPC_URL: str = ""
    WEB3_PRIVATE_KEY: str = ""
    CONTRACT_ADDRESS: str = ""
    
    # CORS (Local development + Vercel deployment)
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    class Config:
        env_file = ".env" if os.path.exists(".env") else "../.env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
