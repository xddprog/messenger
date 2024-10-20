import json
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, Form, UploadFile
from pydantic import UUID4
from starlette.websockets import WebSocketDisconnect, WebSocket

from backend.dto.chat_dto import BaseChatModel
from backend.dto.message_dto import MessageModel
from backend.dto.user_dto import BaseUserModel
from backend.services import ChatService, MessageService, UserService
from backend.utils.dependencies.dependencies import (
    get_chat_service,
    get_chats_manager,
    get_current_user_dependency,
    get_message_service,
    get_user_service,
)
from backend.utils.websockets.chats_manager import ChatsManager


router = APIRouter(
    prefix="/api/chat",
    tags=["chats"],
)


@router.post("/", status_code=201)
async def create_chat(
    chat_service: Annotated[ChatService, Depends(get_chat_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
    id: UUID4 = Form(default_factory=lambda: str(uuid4())),
    users: list[str] = Form(default=[]),
    avatar: UploadFile | None = Form(default=None),
    title: str = Form(),
) -> BaseChatModel:
    print(users)
    users = [await user_service.get_user(user_id) for user_id in users]
    creator = await user_service.get_user(user.id)
    return await chat_service.create_chat(id, title, users, avatar, creator)


@router.get("/{chat_id}/messages/{offset}")
async def get_chat_messages(
    chat_id: UUID4,
    offset: int,
    message_service: Annotated[MessageService, Depends(get_message_service)],
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
    manager: Annotated[ChatsManager, Depends(get_chats_manager)],
):
    await manager.connect(chat_id, websocket)

    user = await user_service.get_user(client_id)
    chat = await chat_service.get_chat(chat_id)

    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)

            if data.get("type") == "delete":
                message = await message_service.delete_message(chat_id, client_id, data.get("message_id"))
            elif data.get("type") == "edit":
                message = await message_service.edit_message(
                    chat_id,
                    client_id,
                    data.get("message_id"),
                    data.get("message"),
                )
            else:
                message = await message_service.create_message(
                    data.get("message"), data.get("images"), user, chat
                )
            
            await manager.broadcast(chat_id, data.get("type"), message.model_dump())

    except WebSocketDisconnect:
        manager.disconnect(chat_id, websocket)
