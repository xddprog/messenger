from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from backend.database.models import Base
from backend.utils.config.config import DatabaseConfig


class DatabaseConnection:
    def __init__(self, config: DatabaseConfig):
        self._engine = create_async_engine(
            url=f"postgresql+asyncpg://{config.db_user}:{config.db_pass}"
            f"@{config.db_host}:{config.db_port}/{config.db_name}",
            poolclass=NullPool,
        )

    async def get_session(self) -> AsyncSession:
        return AsyncSession(bind=self._engine)

    async def __call__(self):
        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        return self
