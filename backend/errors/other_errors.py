from fastapi import HTTPException
from starlette import status


class AllFieldsAreNoneError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы не заполнили ни одно поле!",
        )