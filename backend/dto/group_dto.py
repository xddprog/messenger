from fastapi import UploadFile
from pydantic import UUID4, BaseModel

from backend.dto.user_dto import BaseUserModel


class BaseGroupModel(BaseModel):
    id: UUID4
    title: str
    avatar: str
    cover: str
    description: str | None
    users: list[BaseUserModel]


class GroupModel(BaseGroupModel):
    creator: BaseUserModel
    admins: list[BaseUserModel]


class GroupInfoModel(BaseModel):
    group: GroupModel
    is_subscriber: bool
    is_admin: bool


class UpdateGroupForm(BaseModel):
    title: str | None
    description: str | None
    avatar: UploadFile | None