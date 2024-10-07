from datetime import datetime

from pydantic import UUID4, BaseModel


class CommentBase(BaseModel):
    text: str
    images: list[str] | None = []  # Пустой список по умолчанию
    created_at: datetime


class CommentCreate(CommentBase):
    post_fk: UUID4
    author_fk: str
    parent_id: int | None = None


class CommentModel(CommentBase):
    id: int
    replies: list["CommentModel"] = []
    parent_id: int | None = None
    author_fk: str
    post_fk: UUID4

    class Config:
        from_attributes = True
