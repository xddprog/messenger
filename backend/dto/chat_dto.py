from uuid import uuid4

from pydantic import BaseModel, UUID4, Field

from dto.user_dto import BaseUserModel


class BaseChatModel(BaseModel):
    id: UUID4
    title: str
    avatar: str
    users: list[BaseUserModel]


class CreateChatForm(BaseChatModel):
    id: UUID4 = Field(default_factory=lambda: uuid4())
    users: list[UUID4]
