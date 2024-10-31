from fastapi import HTTPException, WebSocket, WebSocketException
from starlette import status


class MessageNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сообщение не найдено",
        )


class MessageAlreadyRead(WebSocketException):
    def __init__(self):
        super().__init__(
            code=status.HTTP_409_CONFLICT,
            reason="Пользователь уже прочитал это сообщение",
        )
