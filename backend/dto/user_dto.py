from datetime import datetime
from fastapi import UploadFile
from pydantic import BaseModel, field_validator
from sqlalchemy.sql.functions import current_user


class BaseUserModel(BaseModel):
    id: str
    username: str
    email: str
    avatar: str
    cover: str
    images: list
    city: str
    description: str
    birthday: datetime | str

    @field_validator("birthday")
    def validate_birthday(data):
        if isinstance(data, datetime):
            return data.strftime("%Y-%m-%dT%H:%M:%SZ")
        return data


class UpdateUserModel(BaseModel):
    id: str | None
    username: str | None
    email: str | None
    avatar: UploadFile | None = None
    city: str | None
    description: str | None
    birthday: datetime | str | None

    @field_validator("birthday")
    def validate_birthday(data: str):
        if data:
            return datetime.strptime(data, "%Y-%m-%dT%H:%M:%SZ")
        return data


class GetUserDataModel(BaseModel):
    current_user: BaseUserModel
    request_add_friend_is_send: bool
    request_add_friend_is_get: bool
    is_friend: bool
