from datetime import datetime
from pydantic import UUID4, BaseModel, field_validator


class BaseUserModel(BaseModel):
    id: UUID4 | str
    username: str
    email: str
    avatar: str
    city: str
    description: str
    city: str
    birthday: datetime | str

    @field_validator('birthday')
    def validate_birthday(data):
        return data.strftime('%Y-%m-%dT%H:%M:%SZ')