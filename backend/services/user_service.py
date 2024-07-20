from pydantic import UUID4
from database.models import Post, User
from services import BaseService


class UserService(BaseService):
    async def get_user(self, user_id: UUID4) -> User:
        user = await self.repository.get_item(user_id)
        return user
    