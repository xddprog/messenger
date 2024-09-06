from datetime import datetime

from pydantic import BaseModel, UUID4, field_validator

from backend.dto.user_dto import BaseUserModel


class MessageModel(BaseModel):
    id: int
    message: str
    created_at: datetime | str
    user: BaseUserModel

    @field_validator('created_at')
    def format_created_at(cls, value: datetime) -> str:
        months = [
            'января', 'февраля', 'марта', 'апреля',
            'мая', 'июня', 'июля', 'августа',
            'сентября', 'октября', 'ноября', 'декабря'
        ]
        return f'{value.day} {months[value.month - 1]}, {str(value.hour).zfill(2)}:{value.minute}'

    @field_validator('user')
    def format_user(cls, user: BaseUserModel) -> BaseUserModel:
        user.id = str(user.id)

        return user
