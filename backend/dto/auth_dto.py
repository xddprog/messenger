from datetime import datetime
from uuid import uuid4
from pydantic import UUID4, BaseModel, Field

from backend.dto.user_dto import BaseUserModel


class RegisterForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    username: str
    password: str
    email: str
    description: str
    city: str
    birthday: datetime


class LoginForm(BaseModel):
    email: str
    password: str


class RegisterResponse(BaseModel):
    detail: str
    new_user: BaseUserModel
    token: str


class LoginResponse(BaseModel):
    detail: str
    user: BaseUserModel
    token: str