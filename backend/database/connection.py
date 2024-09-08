from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import create_async_engine

from backend.database.models import Base
from backend.utils.config.config import load_database_config

config = load_database_config()
url = f'postgresql+asyncpg://{config.db_user}:{config.db_pass}@{config.db_host}:{config.db_port}/{config.db_name}'
engine = create_async_engine(url, poolclass=NullPool)


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    