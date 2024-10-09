from fastapi import HTTPException
from starlette import status


class GroupNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Группа не найдена!",
        )
