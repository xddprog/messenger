from typing import Any

from redis import Redis

from backend.utils.config.config import RedisConfig


class RedisCache:
    def __init__(self, config: RedisConfig) -> None:
        self.redis: Redis = Redis(host=config.host, port=config.port)

    async def set_item(self, key: str, value: Any) -> None:
        self.redis.set(key, value)

    async def get_item(self, key: str) -> Any:
        return self.redis.get(key)

    async def delete_item(self, key: str) -> None:
        self.redis.delete(key)

    async def __call__(self):
        self.redis.flushdb()
        return self
