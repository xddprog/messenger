from uuid import uuid4
from fastapi import UploadFile
from pydantic import UUID4, BaseModel, Field

from backend.dto.user_dto import BaseUserModel


class BaseGroupModel(BaseModel):
    id: UUID4
    title: str
    avatar: str
    cover: str
    description: str | None


class GroupModel(BaseGroupModel):
    users: list[BaseUserModel]
    creator: BaseUserModel
    admins: list[BaseUserModel]
