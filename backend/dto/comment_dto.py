from datetime import datetime
from uuid import uuid4

from pydantic import UUID4, BaseModel, Field

from backend.dto.user_dto import BaseUserModel


class CommentModel(BaseModel):
    id: int
    text: str
    created_at: datetime
    author: BaseUserModel
    images: list[str] | None = None
