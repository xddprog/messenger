from fastapi.websockets import WebSocket
from pydantic import UUID4

from backend.dto.message_dto import MessageModel
from backend.dto.notification_dto import BaseNotificationModel


class ChatsManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, chat_id: str, websocket: WebSocket):
        await websocket.accept()
        if self.active_connections.get(chat_id):
            self.active_connections[chat_id].append(websocket)
        else:
            self.active_connections[chat_id] = [websocket]

    def disconnect(self, chat_id: UUID4, websocket: WebSocket):
        self.active_connections[chat_id].remove(websocket)

    async def broadcast(self, chat_id: UUID4, response_type: str, message: MessageModel):
        for connection in self.active_connections[chat_id]:
            await connection.send_json({"response_type": response_type, "message": message})

    async def send_notification(
        self, user_id: str, notification: BaseNotificationModel
    ):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(
                notification.model_dump()
            )
