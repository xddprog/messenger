from uuid import uuid4
from pydantic import UUID4

from errors.user_errors import UserFriendNotFound, UserNotFound
from database.models import Post, User
from dto.chat_dto import BaseChatModel
from dto.post_dto import PostModel
from dto.user_dto import BaseUserModel
from repositories import UserRepository
from services import BaseService


class UserService(BaseService):
    repository: UserRepository

    @staticmethod
    async def get_profile_avatar_url(user_id: str) -> str:
        return f'users/{user_id}/images/{uuid4()}'

    async def get_all_users(self):
        users = await self.repository.get_all_items()
        return await self.dump_items(users, BaseUserModel)

    async def get_user(self, user_id: str) -> User:
        user = await self.repository.get_item(user_id)

        await self.check_item(user, UserNotFound)

        return user

    async def get_user_chats(self, user_id: str) -> list[UUID4]:
        user = await self.repository.get_item(user_id)

        await self.check_item(user, UserNotFound)

        return [chat.id for chat in user.chats]

    async def get_user_posts(self, user_id: str) -> list[PostModel]:
        user = await self.repository.get_item(user_id)
        
        await self.check_item(user, UserNotFound)

        return await self.dump_items(user.posts, PostModel)

    async def add_friend(self, user_id: str, friend_id: str):
        friend = await self.check_friend(user_id, friend_id)

        await self.check_item(friend, UserFriendNotFound)

        await self.repository.add_friend(user_id, friend_id)

    async def remove_friend(self, user_id: str, friend_id: str):
        friend = await self.repository.get_item(friend_id)
        
        await self.check_item(friend, UserFriendNotFound)

        await self.repository.remove_friend(user_id, friend_id)

    async def get_friends(self, user_id: str):
        user = await self.repository.get_item(user_id)

        await self.check_item(user, UserNotFound)

        friends = [
            await self.model_dump(
                db_model=await self.repository.get_item(friend_id),
                dto_model=BaseUserModel
            )
            for friend_id in user.friends
        ]
        return friends

    async def check_friend(self, user_id: str, friend_id: str):
        user = await self.repository.get_item(user_id)
        return friend_id in user.friends

    async def search_users(self, username: str, **kwargs) -> list[BaseUserModel] | None:
        users = await self.repository.search_users(username, **kwargs)
        return await self.dump_items(users, BaseUserModel) if users else []

    async def update_user_profile(self, user_id: str, form: BaseUserModel) -> BaseUserModel:
        user = await self.repository.get_item(user_id)

        await self.check_item(user, UserNotFound)

        if form.avatar:
            form.avatar = await self.s3_client.upload_one_file(
                file=form.avatar,
                path=await self.get_profile_avatar_url(user_id)
            )
        
        return await self.repository.update_item(
            user_id,
            **form.model_dump(exclude_none=True)
        )
    