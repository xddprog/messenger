from datetime import datetime

from fastapi import UploadFile
from pydantic import UUID4, BaseModel, field_validator

from backend.dto.group_dto import GroupModel
from backend.dto.user_dto import BaseUserModel


class AuthorModel(BaseModel):
    id: str
    username: str
    avatar: str | None


class PostModel(BaseModel):
    id: UUID4
    author: AuthorModel
    description: str | None = None
    images: list[str] | None = None
    likes: list[BaseUserModel] | None = None
    created_at: datetime | str
    views: int
    group: GroupModel | None = None

    @field_validator("created_at")
    def format_created_at(cls, value: datetime) -> str:
        months = [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря", 
        ]
        return f"{value.day} {months[value.month - 1]}, {str(value.hour).zfill(2)}:{str(value.minute).zfill(2)}"

class UpdatePostModel(BaseModel):
    description: str
    new_images: list[str] 
    old_images: list[UploadFile]