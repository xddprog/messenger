from pydantic import UUID4
from database.models import Post, User
from dto.chat_dto import BaseChatModel
from dto.post_dto import PostModel
from services import BaseService


class UserService(BaseService):
    async def get_user(self, user_id: UUID4) -> User:
        user = await self.repository.get_item(user_id)
        return user

    async def get_user_chats(self, user_id: UUID4) -> list[UUID4]:
        user = await self.repository.get_item(user_id)
        return [chat.id for chat in user.chats]

    async def get_user_posts(self, user_id: UUID4):
        user = await self.repository.get_item(user_id)
        return await self.dump_items(user.posts, PostModel)
    