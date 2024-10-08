from uuid import uuid4
from pydantic import UUID4

from backend.dto.group_dto import BaseGroupModel
from backend.errors.user_errors import UserAlreadyHaveThisFriend, UserNotFound
from backend.database.models import User
from backend.dto.post_dto import PostModel
from backend.dto.user_dto import BaseUserModel
from backend.repositories import UserRepository
from backend.services import BaseService


class UserService(BaseService):
    repository: UserRepository

    @staticmethod
    async def get_profile_avatar_url(user_id: str) -> str:
        return f"users/{user_id}/images/{uuid4()}"

    async def get_all_users(self) -> list[BaseUserModel]:
        users = await self.repository.get_all_items()
        return await self.dump_items(users, BaseUserModel)

    async def get_user(self, user_id: str) -> User:
        user = await self.repository.get_item(user_id)
        return user

    async def get_user_chats(self, user_id: str) -> list[UUID4]:
        user = await self.repository.get_item(user_id)

        return [chat.id for chat in user.chats]

    async def get_user_posts(self, user_id: str) -> list[PostModel]:
        user = await self.repository.get_item(user_id)

        return [post.id for post in user.posts]

    async def get_user_groups(self, user_id: str) -> list[BaseGroupModel]:
        user = await self.repository.get_item(user_id)

        return [
            await self.model_dump(group, BaseGroupModel)
            for group in user.groups
        ]

    async def get_user_admined_groups(
        self, user_id: str
    ) -> list[BaseGroupModel]:
        user = await self.repository.get_item(user_id)

        return [
            await self.model_dump(group, BaseGroupModel)
            for group in user.user_admined_groups
        ]

    async def add_friend(self, user_id: str, friend_id: str) -> None:
        user = await self.repository.get_item(user_id)
        friend = await self.repository.get_item(friend_id)

        await self.check_item(friend, UserNotFound)

        if friend_id in user.friends:
            raise UserAlreadyHaveThisFriend

        await self.repository.add_friend(user_id, friend_id)

    async def remove_friend(self, user_id: str, friend_id: str) -> None:
        await self.check_friend(user_id, friend_id)
        await self.repository.remove_friend(user_id, friend_id)

    async def get_friends(self, user_id: str) -> list[BaseUserModel]:
        user = await self.repository.get_item(user_id)

        friends = [
            await self.model_dump(
                db_model=await self.repository.get_item(friend_id),
                dto_model=BaseUserModel,
            )
            for friend_id in user.friends
        ]
        return friends

    async def check_friend(self, user_id: str, friend_id: str) -> bool:
        user = await self.repository.get_item(user_id)
        friend = await self.repository.get_item(friend_id)

        await self.check_item(friend, UserNotFound)

        return friend_id in user.friends

    async def search_users(
        self, username: str, **kwargs
    ) -> list[BaseUserModel] | None:
        users = await self.repository.search_users(username, **kwargs)
        return await self.dump_items(users, BaseUserModel) if users else []

    async def update_user_profile(
        self, user_id: str, form: BaseUserModel
    ) -> BaseUserModel:
        user = await self.repository.get_item(user_id)

        if form.avatar:
            form.avatar = await self.s3_client.upload_one_file(
                file=form.avatar,
                path=await self.get_profile_avatar_url(user_id),
            )

        return await self.repository.update_item(
            user_id, **form.model_dump(exclude_none=True)
        )
