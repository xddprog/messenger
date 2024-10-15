from fastapi import UploadFile
from pydantic import UUID4
from backend.database.models import User
from backend.dto.group_dto import BaseGroupModel, GroupModel
from backend.errors.group_errors import GroupNotFound
from backend.repositories.group_repository import GroupRepository
from backend.services.base_service import BaseService


class GroupService(BaseService):
    repository: GroupRepository

    @staticmethod
    async def create_group_avatar_url(group_id: UUID4) -> str:
        return f"groups/{group_id}/avatars/"

    @staticmethod
    async def create_group_cover_url(group_id: UUID4) -> str:
        return f"groups/{group_id}/covers/"

    async def get_all_groups(self) -> list:
        groups = await self.repository.get_all_items()
        return await self.dump_items(groups, BaseGroupModel)

    async def get_one_group(self, group_id: int) -> GroupModel:
        group = await self.repository.get_item(group_id)

        await self.check_item(group, GroupNotFound)

        return await self.model_dump(group, GroupModel)

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
        id: UUID4,
        title: str,
        description: str,
        avatar: UploadFile | None,
        cover: UploadFile | None,
        creator: User,
    ) -> BaseGroupModel:
        if avatar:
            avatar = await self.s3_client.upload_one_file(
                file=avatar, path=await self.create_group_avatar_url(id)
            )

        if cover:
            cover = await self.s3_client.upload_one_file(
                file=cover,
                path=await self.create_group_cover_url(id),
            )

        new_group = await self.repository.add_item(
            id=id,
            title=title,
            description=description,
            avatar=avatar,
            cover=cover,
            creator=creator,
        )
        return await self.model_dump(new_group, BaseGroupModel)

    async def delete_group(self, group_id: int):
        group = await self.repository.get_item(group_id)

        await self.check_item(group, GroupNotFound)

        await self.repository.delete_item(group)

    async def join_user_to_group(
        self, group_id: int, user: User
    ) -> BaseGroupModel:
        group = await self.repository.get_item(group_id)

        await self.check_item(group, GroupNotFound)

        await self.repository.join_user_to_group(group, user)
