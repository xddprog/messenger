from datetime import datetime
from tkinter import N
from fastapi import Form, UploadFile
from pydantic import UUID4, BaseModel, field_validator


class BaseUserModel(BaseModel):
    id: str
    username: str
    email: str
    avatar: str
    city: str
    description: str
    birthday: datetime | str

    @field_validator('birthday')
    def validate_birthday(data):
        return data.strftime('%Y-%m-%dT%H:%M:%SZ')
    

class UpdateUserModel(BaseModel):
    id: str | None
    username: str | None
    email: str | None
    avatar: None = None
    city: str | None
    description: str | None
    birthday: datetime | str | None

    @field_validator('birthday')
    def validate_birthday(data: str):
        if data:
            return datetime.strptime(data, '%Y-%m-%dT%H:%M:%SZ')
        return data