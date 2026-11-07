from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        db = client[settings.MONGODB_DB_NAME]
        print(f"✅ Connected to MongoDB: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f"⚠️ Warning: Could not connect to MongoDB: {e}")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("🛑 Closed MongoDB connection")


def get_database():
    return db
