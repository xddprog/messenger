from fastapi import HTTPException
from starlette import status


class UserNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Пользователь не найден'
        )


class UserFriendNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='У пользователя нет такого друга'
        )