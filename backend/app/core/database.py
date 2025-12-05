from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from app.core.config import settings

# Convert sync psycopg2 URL to asyncpg URL if necessary
DATABASE_URL_ASYNC = settings.DATABASE_URL.replace("postgresql+psycopg2", "postgresql+asyncpg")

connect_args = {}
# asyncpg does not support sslmode or channel_binding in the connection string
if "?" in DATABASE_URL_ASYNC:
    base_url, query_str = DATABASE_URL_ASYNC.split("?", 1)
    params = query_str.split("&")
    
    # Check if sslmode=require is present
    ssl_required = any(p.startswith("sslmode=require") for p in params)
    
    # Filter out sslmode and channel_binding
    filtered_params = [p for p in params if not p.startswith("sslmode=") and not p.startswith("channel_binding=")]
    
    if filtered_params:
        DATABASE_URL_ASYNC = f"{base_url}?{'&'.join(filtered_params)}"
    else:
        DATABASE_URL_ASYNC = base_url

    if ssl_required:
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        connect_args["ssl"] = ctx

# Use NullPool in test/dev runs to avoid reusing connections across event loops.
# Reusing pooled asyncpg connections created on a different event loop can
# cause "attached to a different loop" RuntimeErrors during tests which spawn
# multiple event loops. NullPool forces a fresh connection per use and is safe
# for test runs. For production, consider a tuned pool appropriate to your
# workload.
engine = create_async_engine(
    DATABASE_URL_ASYNC,
    future=True,
    echo=False,
    poolclass=NullPool,
    connect_args=connect_args,
)

# Use an async session factory. expire_on_commit=False is helpful in async flows
# to avoid needing to refresh objects after commits in many tests.
AsyncSessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession, future=True)
Base = declarative_base()


async def init_db():
    # Import models so they are registered with the Base metadata before create_all
    from app import models  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_session() -> AsyncSession:
    """FastAPI dependency that yields a transactional AsyncSession.

    Usage in routes: `db: AsyncSession = Depends(get_session)`
    """
    try:
        async with AsyncSessionLocal() as session:
            yield session
    except Exception as e:
        print(f"CRITICAL ERROR in get_session: {e}")
        import traceback
        traceback.print_exc()
        raise e
