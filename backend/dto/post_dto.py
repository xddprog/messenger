from datetime import datetime

from pydantic import UUID4, BaseModel, Field, field_validator, validator

from dto.user_dto import BaseUserModel


class AuthorModel(BaseModel):
    id: str
    username: str
    avatar: str | None


class PostModel(BaseModel):
    id: UUID4
    author: AuthorModel
    description: str
    images: list[str] | None = None
    likes: list[BaseUserModel] | None = None
    created_at: datetime | str
    views: int

    @field_validator('created_at')
    def format_created_at(cls, value: datetime) -> str:
        months = [
            'января', 'февраля', 'марта', 'апреля', 
            'мая', 'июня', 'июля', 'августа', 
            'сентября', 'октября', 'ноября', 'декабря'
        ]
        return f'{value.day} {months[value.month - 1]}, {str(value.hour).zfill(2)}:{value.minute}'
