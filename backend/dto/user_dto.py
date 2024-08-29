from pydantic import UUID4, BaseModel, field_validator


class BaseUserModel(BaseModel):
    id: UUID4 | str
    username: str
    email: str
    avatar: str
