from datetime import datetime
import json
from typing import Annotated

from fastapi import APIRouter, Depends, Form, UploadFile
from pydantic import UUID4
from sqlalchemy.util import await_only

from backend.dto.user_dto import BaseUserModel, UpdateUserModel
from backend.services.post_service import PostService
from backend.utils.redis_cache import RedisCache
from backend.dto.chat_dto import BaseChatModel
from backend.services import UserService, ChatService
from backend.utils.dependencies import get_post_service, get_redis, get_user_service, get_chat_service


router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)


@router.get('/all')
async def get_all_users(
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.get_all_users()


@router.get('/{user_id}')
async def get_user(
    user_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
):
    user = await user_service.get_user(user_id)
    return await user_service.model_dump(user, BaseUserModel)


@router.get('/{user_id}/chats')
async def get_user_chats(
    user_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    chats_service: Annotated[ChatService, Depends(get_chat_service)]
):
    chats = await user_service.get_user_chats(user_id)
    chats_models = [await chats_service.get_chat(chat_id) for chat_id in chats]
    return await chats_service.dump_items(chats_models, BaseChatModel)


@router.get('/{user_id}/posts')
async def get_user_posts(
    user_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    post_service: Annotated[PostService, Depends(get_post_service)]
):
    posts = await user_service.get_user_posts(user_id)
    return [await post_service.get_one_post(post_id) for post_id in posts]


@router.get('/{user_id}/friends/all')
async def get_user_friends(
    user_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.get_friends(user_id)


@router.get('/{user_id}/friends/{friend_id}')
async def get_check_is_friend_or_not(
    user_id: str,
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.check_friend(user_id, friend_id)


@router.post('/{user_id}/friends/add/{friend_id}')
async def add_friend(
    user_id: str,
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)]
) -> dict:
    await user_service.add_friend(user_id, friend_id)
    return {
        'detail': f'Пользователь {user_id} успешно добавил {friend_id} в друзья'
    }


@router.delete('/{user_id}/friends/remove/{friend_id}')
async def remove_friend(
    user_id: str,
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    await user_service.remove_friend(user_id, friend_id)
    return {
        'detail': f'Пользователь {user_id} успешно удалил {friend_id} из друзей'
    }


@router.get('/search')
async def search_users(
    username: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    redis_cache: Annotated[RedisCache, Depends(get_redis)]
):
    users = await redis_cache.get_item(username)

    if not users:
        users = await user_service.search_users(username)
        await redis_cache.set_item(
            username, 
            json.dumps(
                [user.model_dump() for user in users]
            )
        )
    else:
        users = json.loads(users)
    return users


@router.put('/{user_id}/profile/update')
async def update_user_profile(
    user_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    id: str | None = Form(default=None),
    username: str | None = Form(default=None),
    email: str | None = Form(default=None),
    avatar: UploadFile| None = Form(default=None),
    city: str | None = Form(default=None),
    description: str | None = Form(default=None),
    birthday: datetime | None = Form(default=None),
):
    return await user_service.update_user_profile(
        user_id, 
        UpdateUserModel(
            id=id,
            username=username,
            email=email,
            avatar=avatar,
            city=city,
            description=description,
            birthday=birthday
        )
    )