from uuid import uuid4
from pydantic import UUID4, BaseModel, Field


class TokenModel(BaseModel):
    access_token: str
    user_id: UUID4
    

class RegisterForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    username: str
    password: str
    email: str


class LoginForm(BaseModel):
    email: str
    password: str