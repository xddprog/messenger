from fastapi.websockets import WebSocket

from backend.dto.message_dto import MessageModel


class WebSocketManager:
    def __init__(self, *args, **kwargs):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: MessageModel):
        for connection in self.active_connections:
            await connection.send_json(message.model_dump())
