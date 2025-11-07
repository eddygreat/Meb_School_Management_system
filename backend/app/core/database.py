from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from app.core.config import settings

# Convert sync psycopg2 URL to asyncpg URL if necessary
DATABASE_URL_ASYNC = settings.DATABASE_URL.replace("postgresql+psycopg2", "postgresql+asyncpg")

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
    async with AsyncSessionLocal() as session:
        yield session
