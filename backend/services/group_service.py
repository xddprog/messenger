from fastapi import UploadFile
from pydantic import UUID4
from backend.database.models import User
from backend.dto.group_dto import BaseGroupModel, GroupInfoModel, GroupModel, UpdateGroupForm
from backend.dto.post_dto import PostModel
from backend.dto.user_dto import BaseUserModel
from backend.errors.group_errors import GroupNotFound
from backend.repositories.group_repository import GroupRepository
from backend.services.base_service import BaseService


class GroupService(BaseService):
    repository: GroupRepository

    @staticmethod
    async def create_group_avatar_url(group_id: str) -> str:
        return f"groups/{group_id}/avatars/"

    @staticmethod
    async def create_group_cover_url(group_id: str) -> str:
        return f"groups/{group_id}/covers/"
    
    async def check_group_exist(self, group_id: str):
        group = await self.repository.get_item(group_id)
        await self.check_item(group, GroupNotFound)

    async def get_all_groups(self) -> list:
        groups = await self.repository.get_all_items()
        return await self.dump_items(groups, BaseGroupModel)

    async def get_one_group(self, group_id: str, user_id: str) -> GroupInfoModel:
        group = await self.repository.get_item(group_id)
        is_admin = await self.repository.check_user_is_admin(user_id, group_id)
        is_subscriber = await self.repository.check_user_is_subscriber(user_id, group_id)
        await self.check_item(group, GroupNotFound)
        return GroupInfoModel(
            group=await self.model_dump(group, GroupModel),
            is_subscriber=bool(is_subscriber),
            is_admin=bool(is_admin)
        )

    async def get_user_groups(self, user_id: str) -> list[BaseGroupModel]:
        groups = await self.repository.get_user_groups(user_id)
        return await self.dump_items(groups, BaseGroupModel)

    async def get_user_admined_groups(
        self, user_id: str
    ) -> list[BaseGroupModel]:
        groups = await self.repository.get_user_admined_groups(user_id)
        return await self.dump_items(groups, BaseGroupModel)

    async def create_group(
        self,
        group_id: str,
        title: str,
        description: str,
        avatar: UploadFile | None,
        cover: UploadFile | None,
        creator: str,
    ) -> BaseGroupModel:
        if avatar:
            avatar = await self.s3_client.upload_one_file(
                file=avatar, path=await self.create_group_avatar_url(group_id)
            )

        if cover:
            cover = await self.s3_client.upload_one_file(
                file=cover,
                path=await self.create_group_cover_url(group_id),
            )

        new_group = await self.repository.add_item(
            id=group_id,
            title=title,
            description=description,
            avatar=avatar,
            cover=cover,
            creator=creator,
        )
        return await self.model_dump(new_group, BaseGroupModel)
    
    async def delete_group(self, group_id: str):
        group = await self.repository.get_item(group_id)
        await self.check_item(group, GroupNotFound)
        await self.repository.delete_item(group)

    async def join_user_to_group(
        self, group_id: str, user_id: str
    ) -> bool:
        group = await self.repository.get_item(group_id)
        await self.check_item(group, GroupNotFound)
        return await self.repository.join_user_to_group(group_id, user_id)

    async def get_subscribers(self, group_id: str) -> list[BaseGroupModel]:
        group = await self.repository.get_item(group_id)
        await self.check_item(group, GroupNotFound)

        users = await self.repository.get_subscribers(group_id)
        return await self.dump_items(users, BaseUserModel)

    async def update_group(
        self, 
        group_id: str, 
        form: UpdateGroupForm
    ) -> GroupModel:
        group = await self.repository.get_item(group_id)
        await self.check_item(group, GroupNotFound)

        if form.avatar:
            avatar = await self.s3_client.upload_one_file(
                file=avatar, 
                path=await self.create_group_avatar_url(group_id)
            )

        group = await self.repository.update_item(
            group_id, 
            **form.model_dump(exclude_none=True)
        )
        return await self.model_dump(group, GroupModel)

    async def get_group_posts(self, group_id: str) -> list[PostModel]:
        posts = await self.repository.get_group_posts(group_id)
        return await self.dump_items(posts, PostModel)