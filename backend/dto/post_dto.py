from datetime import datetime
from pydantic import UUID4, BaseModel, Field, field_validator, validator


class AutorModel(BaseModel):
    id: UUID4
    username: str


class PostModel(BaseModel):
    id: int
    author: AutorModel
    description: str
    images: list[str] | None = None
    likes: int 
    dislikes: int
    created_at: datetime 
    views: int

    @field_validator('created_at')
    def format_created_at(cls, value: datetime) -> str:
        months = [
            'января', 'февраля', 'марта', 'апреля', 
            'мая', 'июня', 'июля', 'августа', 
            'сентября', 'октября', 'ноября', 'декабря'
        ]
        return f'{value.day} {months[value.month - 1]}, {str(value.hour).zfill(2)}:{value.minute}'

class CreatePostModel(BaseModel):
    description: str | None = None
    images: list[str] | None = None
    author: UUID4