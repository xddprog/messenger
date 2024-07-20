from pydantic import UUID4, BaseModel


class UserBase(BaseModel):
    id: UUID4
    username: str
    email: str