from pydantic import UUID4
from database.models import Post, User
from dto.chat_dto import BaseChatModel
from dto.post_dto import PostModel
from dto.user_dto import BaseUserModel
from repositories import UserRepository
from services import BaseService


class UserService(BaseService):
    repository: UserRepository

    async def get_all_users(self):
        return await self.repository.get_all_items()

    async def get_user(self, user_id: UUID4) -> User:
        user = await self.repository.get_item(user_id)
        return user

    async def get_user_chats(self, user_id: UUID4) -> list[UUID4]:
        user = await self.repository.get_item(user_id)
        return [chat.id for chat in user.chats]

    async def get_user_posts(self, user_id: UUID4) -> list[PostModel]:
        user = await self.repository.get_item(user_id)
        return await self.dump_items(user.posts, PostModel)

    async def add_friend(self, user_id: UUID4, friend_id: UUID4):
        await self.repository.add_friend(user_id, friend_id)

    async def remove_friend(self, user_id: UUID4, friend_id: UUID4):
        await self.repository.remove_friend(user_id, friend_id)

    async def get_friends(self, user_id: UUID4):
        user = await self.repository.get_item(user_id)
        friends = [
            await self.model_dump(
                db_model=await self.repository.get_item(friend_id),
                dto_model=BaseUserModel
            )
            for friend_id in user.friends
        ]
        return friends

    async def check_friend(self, user_id: UUID4, friend_id: UUID4):
        user = await self.repository.get_item(user_id)
        return friend_id in user.friends

    async def search_users(self, username: str, **kwargs) -> list[BaseUserModel] | None:
        users = await self.repository.search_users(username, **kwargs)
        return await self.dump_items(users, BaseUserModel) if users else []

    async def update_set_profile_data(self, user_id: UUID4, form: BaseUserModel) -> BaseUserModel:
        user = await self.repository.update_item(**form.model_dump())
        return user
    