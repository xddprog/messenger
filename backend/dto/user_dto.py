from pydantic import UUID4, BaseModel


class BaseUserModel(BaseModel):
    id: UUID4
    username: str
    email: str
    avatar: str
