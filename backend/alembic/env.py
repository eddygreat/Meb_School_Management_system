from __future__ import with_statement
import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Make sure the 'app' directory is in the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import your Base and all models so Alembic can see them
from app.db.base import Base
from app.models import user, security

# This is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Use DATABASE_URL from env if present
db_url = os.getenv('DATABASE_URL', None)
if db_url:
    # For PostgreSQL, Alembic needs a sync driver.
    if 'postgresql+asyncpg' in db_url:
        db_url = db_url.replace('postgresql+asyncpg', 'postgresql+psycopg2')
    config.set_main_option('sqlalchemy.url', db_url)

# This is the target metadata for Alembic autogeneration
target_metadata = Base.metadata

# Interpret the config file for Python logging.
# and set up loggers.

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"})

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
