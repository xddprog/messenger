from email.policy import default
from typing import Annotated

from fastapi import APIRouter, Depends, Form, UploadFile
from pydantic import UUID4
from starlette.websockets import WebSocketDisconnect, WebSocket

from backend.dto.chat_dto import BaseChatModel, CreateChatForm
from backend.dto.message_dto import MessageModel
from backend.services import ChatService, MessageService, UserService
from backend.utils.dependencies import get_chat_service, get_message_service, get_user_service
from backend.utils.websocket_manager import WebSocketManager

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


@router.post('/create', status_code=201)
async def create_chat(
    form: CreateChatForm,
    chat_service: Annotated[ChatService, Depends(get_chat_service)],
    user_service: Annotated[UserService, Depends(get_user_service)]
) -> BaseChatModel:
    form.users = [await user_service.get_user(user_id) for user_id in form.users]
    return await chat_service.create_chat(form)


@router.get('/{chat_id}/messages/{offset}')
async def get_chat_messages(
    chat_id: UUID4,
    offset: int,
    message_service: Annotated[MessageService, Depends(get_message_service)]
) -> list[MessageModel]:
    return await message_service.get_messages_from_chat(chat_id, offset)


@router.websocket("/ws/{chat_id}/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    chat_id: UUID4,
    chat_service: Annotated[ChatService, Depends(get_chat_service)],
    message_service: Annotated[MessageService, Depends(get_message_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
):
    await manager.connect(websocket)

    user = await user_service.get_user(client_id)
    chat = await chat_service.get_chat(chat_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            images = await websocket.receive_bytes(data)
            message = await message_service.create_message(data, images, user, chat)
            await manager.broadcast(message)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@router.delete('/messages/{message_id}')
async def delete_message(
    message_id: int,
    message_service: Annotated[MessageService, Depends(get_message_service)]
) -> MessageModel:
    await message_service.delete_message(message_id)
    return  {
        'detail': 'Сообщение удалено'
    }

@router.put('/messages/{message_id}')
async def edit_message(
    message_id: int,
    message_service: Annotated[MessageService, Depends(get_message_service)],
    message: str | None = Form(default=None),
    new_images: list[UploadFile] | None = Form(default=None),
    deleted_images: list[str] | None = Form(default=None),
    user_id: str = Form(default=None),
    chat_id: str = Form(default=None)
) -> MessageModel:
    return await message_service.edit_message(
        user_id=user_id,
        chat_id=chat_id,
        message_id=message_id, 
        message=message, 
        new_images=new_images,
        delete_images=deleted_images
    )