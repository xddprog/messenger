from re import sub
from uuid import uuid4
from fastapi import UploadFile
from pydantic import UUID4, BaseModel, Field, field_validator

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
