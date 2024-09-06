import asyncio
from typing import Generator
from httpx import AsyncClient
import pytest
from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from backend.database.connection import engine
from backend.database.models import Base
from backend.main import app
from backend.utils.config.config import load_database_config


config = load_database_config()
url = f'postgresql+asyncpg://{config.db_user}:{config.db_pass}@{config.db_host}:{config.db_port}/{config.db_name}'
engine = create_async_engine(url, poolclass=NullPool)


@pytest.fixture(autouse=True, scope='session')
async def start_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

        
@pytest.fixture(scope="session")
def event_loop() -> Generator:
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session", autouse=False)
async def async_client():
    async with AsyncClient(app=app, base_url='http://localhost:5000') as client:
        yield client


@pytest.fixture(scope='session', autouse=False)
async def db_session():
    session = AsyncSession(bind=engine)
    try:
        yield session
    finally:
        await session.close()
