from functools import wraps
from typing import Any, Callable

from redis import Redis

from backend.utils.config.config import REDIS_CONFIG


class RedisCache:
    def __init__(self) -> None:
        self.redis: Redis = Redis(host=REDIS_CONFIG.redis_host, port=REDIS_CONFIG.redis_port)
        self.redis.flushdb()

    async def set_item(self, key: str, value: Any) -> None:
        self.redis.set(key, value)

    async def get_item(self, key: str) -> Any:
        return self.redis.get(key)

    async def delete_item(self, key: str) -> None:
        self.redis.delete(key)
