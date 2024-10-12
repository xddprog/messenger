from pydantic import UUID4, BaseModel

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
