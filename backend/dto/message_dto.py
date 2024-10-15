from datetime import datetime

from pydantic import BaseModel, field_validator

from backend.dto.user_dto import BaseUserModel


class MessageModel(BaseModel):
    id: int
    message: str
    created_at: datetime | str
    user: BaseUserModel

    @field_validator("user")
    def format_user(cls, user: BaseUserModel) -> BaseUserModel:
        user.id = str(user.id)
        return user
    