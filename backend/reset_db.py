import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import Base
from sqlalchemy.ext.asyncio import create_async_engine

async def reset_database():
    print(f"Connecting to: {settings.DATABASE_URL}")
    
    # Handle SSL for asyncpg
    connect_args = {}
    url = settings.DATABASE_URL
    if "sslmode=require" in url:
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        connect_args["ssl"] = ctx
        url = url.replace("?sslmode=require", "").replace("&sslmode=require", "").replace("&channel_binding=require", "")

    engine = create_async_engine(url, echo=True, connect_args=connect_args)
    
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("All tables dropped.")

if __name__ == "__main__":
    asyncio.run(reset_database())
