from datetime import datetime
from enum import Enum

from pydantic import BaseModel, field_validator

from backend.dto.user_dto import BaseUserModel


class MessageTypes(str, Enum):
    CREATE = "create"
    EDIT = "edit"
    DELETE = "delete"
    READ = "read"


class MessageModel(BaseModel):
    id: int
    message: str
    created_at: datetime | str
    user: BaseUserModel
    is_edited: bool
    images: list[str] | None = None
    users_who_readed: list[BaseUserModel] | list[str] | None = None

    @field_validator("user")
    def format_user(cls, user: BaseUserModel) -> BaseUserModel:
        user.id = str(user.id)
        return user

    @field_validator("created_at")
    def format_created_at(cls, created_at: datetime) -> datetime:
        return created_at.isoformat()


class DeleteMessageModel(BaseModel):
    id: int
    created_at: datetime | str

    @field_validator("created_at")
    def format_created_at(cls, created_at: datetime) -> datetime:
        return created_at.isoformat()


class WebsocketMessageModel(BaseModel):
    response_type: str
    status_code: int
    message: MessageModel
