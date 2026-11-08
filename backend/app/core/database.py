from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    global client, db
    try:
        # 1-second timeout so offline DB never delays or blocks AI responses
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=1000,
            connectTimeoutMS=1000,
        )
        db = client[settings.MONGODB_DB_NAME]
        print(f"[OK] Connected to MongoDB client: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f"[WARN] Warning: Could not connect to MongoDB: {e}")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("[INFO] Closed MongoDB connection")


def get_database():
    return db
