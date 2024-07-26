from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import UUID4

from dto.chat_dto import BaseChatModel
from services import UserService, ChatService
from utils.dependencies import get_user_service, get_chat_service

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)


@router.get('/{user_id}/chats')
async def get_user_chats(
    user_id: UUID4,
    user_service: Annotated[UserService, Depends(get_user_service)],
    chats_service: Annotated[ChatService, Depends(get_chat_service)]
):
    chats = await user_service.get_user_chats(user_id)
    chats_models = [await chats_service.get_chat(chat_id) for chat_id in chats]
    return await chats_service.dump_items(chats_models, BaseChatModel)


@router.get('/{user_id}/posts')
async def get_user_posts(
    user_id: UUID4,
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.get_user_posts(user_id)
