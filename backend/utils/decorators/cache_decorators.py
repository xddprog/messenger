from functools import wraps
import json
from typing import Callable
from backend.services.auth_service import AuthService
from backend.services.user_service import UserService
from backend.utils.clients.redis_client import RedisCache


class CacheUser(RedisCache):
    def __call__(self, func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs) -> str:
            auth_service: AuthService = kwargs.get("auth_service")
            email = await auth_service.verify_token(
                kwargs.get("token")
            )
            user = await self.get_item(email)
            if user:
                return user.decode()
            
            result = await func(*args, **kwargs)
            await self.set_item(email, (await auth_service.get_user_by_email(email)).id)
            return result

        return wrapper
    

class CacheUsersSearch(RedisCache):
    def __call__(self, func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs) -> str:
            username = kwargs.get("username")
            users = await self.get_item(username)

            if not users:
                result = await func(*args, **kwargs)
                await self.set_item(
                    username, json.dumps([user.model_dump() for user in result])
                )
                return result
            else:
                return json.loads(users)
        return wrapper
    

class CacheCitiesSearch(RedisCache):
    def __call__(self, func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs) -> str:
            city = kwargs.get("city")
            cities = await self.get_item(city)

            if not cities:
                result = await func(*args, **kwargs)
                await self.set_item(city, json.dumps(result))
                return result
            return json.loads(cities)
        return wrapper