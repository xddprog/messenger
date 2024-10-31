from fastapi.websockets import WebSocket
from pydantic import UUID4, BaseModel
from starlette.responses import JSONResponse

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

    async def broadcast_message(
        self, chat_id: UUID4, response_type: str, message: MessageModel | BaseModel
    ):  
        for connection in self.active_connections[chat_id]:
            try:
                await connection.send_json(
                    {"response_type": response_type, "message": message}
                )
            except RuntimeError:
                self.disconnect(chat_id, connection)
    
    async def broadcast_error(self, chat_id, error):
        print(error.args)
        for connection in self.active_connections[chat_id]:
            await connection.send_json(error)

    async def send_notification(
        self, user_id: str, notification: BaseNotificationModel
    ):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(
                notification.model_dump()
            )
