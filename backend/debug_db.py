import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

async def check_db():
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
        url = url.replace("?sslmode=require", "").replace("&sslmode=require", "")
    
    engine = create_async_engine(url, echo=True, connect_args=connect_args)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        try:
            print("Attempting to select users...")
            res = await session.execute(text("SELECT * FROM users LIMIT 1"))
            print("Success!")
            print(res.fetchall())
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check_db())
