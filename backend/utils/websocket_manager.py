from fastapi.websockets import WebSocket

from backend.dto.message_dto import MessageModel
from backend.dto.notification_dto import BaseNotificationModel


class WebSocketManager:
    def __init__(self, *args, **kwargs):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.update({user_id: websocket})

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id)

    async def broadcast(self, message: MessageModel):
        for connection in self.active_connections:
            # await connection.send_json(message.model_dump())
            await connection.send_json(message)

    async def send_notification(
        self, user_id: str, notification: BaseNotificationModel
    ):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(
                notification.model_dump()
            )
