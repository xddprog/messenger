from typing import Annotated

from fastapi import APIRouter, Depends, Request
from pydantic import UUID4
from starlette.responses import Response
from starlette.websockets import WebSocketDisconnect, WebSocket

from dto.chat_dto import CreateChatForm
from services import ChatService, MessageService, UserService
from utils.dependencies import get_chat_service, get_message_service, get_user_service, get_websocket_manager
from utils.websocket_manager import WebSocketManager

#
# async def lifespan(router: APIRouter, websocket_manager: Depends(get_websocket_manager)):
#     router.websocket_service = websocket_manager
#     yield {
#         'websocket_manager': websocket_manager
#     }



router = APIRouter(
    prefix="/api/chats",
    tags=['chats'],
)


manager = WebSocketManager()


@router.post('/create')
async def create_chat(
    form: CreateChatForm,
    chat_service: Annotated[ChatService, Depends(get_chat_service)],
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    form.users = [await user_service.get_user(user_id) for user_id in form.users]
    return await chat_service.create_chat(form)


@router.get('/{chat_id}/messages/{offset}')
async def get_chat_messages(
    chat_id: UUID4,
    offset: int,
    message_service: Annotated[MessageService, Depends(get_message_service)]
):
    return await message_service.get_messages_from_chat(chat_id, offset)


@router.websocket("/ws/{chat_id}/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    chat_id: UUID4,
    chat_service: Annotated[ChatService, Depends(get_chat_service)],
    message_service: Annotated[MessageService, Depends(get_message_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    manager: Annotated[WebSocketManager, Depends(get_websocket_manager)]
):

    await manager.connect(websocket)

    user = await user_service.get_user(client_id)
    chat = await chat_service.get_chat(chat_id)

    try:
        while True:
            data = await websocket.receive_text()
            message = await message_service.create_message(data, user, chat)
            await manager.broadcast(message)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
