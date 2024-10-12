from uuid import uuid4

from pydantic import BaseModel, UUID4, Field


class BaseChatModel(BaseModel):
    id: UUID4
    title: str
    avatar: str


class CreateChatForm(BaseChatModel):
    id: UUID4 = Field(default_factory=lambda: uuid4())
    users: list[str]
