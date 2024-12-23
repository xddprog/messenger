from datetime import datetime

from pydantic import UUID4, BaseModel, field_validator

from backend.dto.user_dto import BaseUserModel


class CommentBase(BaseModel):
    text: str
    images: list[str] | None = None
    created_at: datetime | str

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


class CommentCreate(CommentBase):
    post_fk: UUID4
    author_fk: str
    parent_id: int | None = None


class CommentModel(CommentBase):
    id: int
    replies: list["CommentModel"] = []
    author: BaseUserModel

    class Config:
        from_attributes = True
