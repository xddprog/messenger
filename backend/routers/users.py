from datetime import datetime
import json
from typing import Annotated

from fastapi import APIRouter, Depends, Form, UploadFile

from backend.dto.group_dto import BaseGroupModel
from backend.dto.post_dto import PostModel
from backend.dto.user_dto import BaseUserModel, UpdateUserModel
from backend.services.group_service import GroupService
from backend.services.post_service import PostService
from backend.utils.redis_cache import RedisCache
from backend.dto.chat_dto import BaseChatModel
from backend.services import UserService, ChatService
from backend.utils.dependencies import (
    get_current_user_dependency,
    get_group_service,
    get_post_service,
    get_redis,
    get_user_service,
    get_chat_service,
)


router = APIRouter(prefix="/api/user", tags=["users"])


@router.get("/search")
async def search_users(
    username: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    redis_cache: Annotated[RedisCache, Depends(get_redis)],
) -> list[BaseUserModel]:
    users = await redis_cache.get_item(username)

    if not users:
        users = await user_service.search_users(username, '')
        await redis_cache.set_item(
            username, json.dumps([user.model_dump() for user in users])
        )
    else:
        users = json.loads(users)
    return users


@router.get("/groups")
async def get_user_groups(
    group_service: Annotated[GroupService, Depends(get_group_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
    user_admined_groups: bool = False,
    user_id: str = None,
) -> list[BaseGroupModel]:
    if user_admined_groups:
        return await group_service.get_user_admined_groups(user.id)
    return await group_service.get_user_groups(user_id if user_id else user.id)


@router.get("/chats")
async def get_user_chats(
    user_service: Annotated[UserService, Depends(get_user_service)],
    chats_service: Annotated[ChatService, Depends(get_chat_service)],
    user: Annotated[BaseUserModel, Depends(get_current_user_dependency)],
) -> list[BaseChatModel]:
    chats = await user_service.get_user_chats(user.id)
    chats_models = [await chats_service.get_chat(chat_id) for chat_id in chats]
    return await chats_service.dump_items(chats_models, BaseChatModel)


@router.get("/posts")
async def get_user_posts(
    user_service: Annotated[UserService, Depends(get_user_service)],
    post_service: Annotated[PostService, Depends(get_post_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
    user_id: str = None,
) -> list[PostModel]:
    posts = await user_service.get_user_posts(user_id if user_id else user.id)
    return [await post_service.get_one_post(post_id) for post_id in posts]


@router.get("/{user_id}")
async def get_user(
    user_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
) -> BaseUserModel:
    user = await user_service.get_user(user_id)
    return await user_service.model_dump(user, BaseUserModel)


@router.get("/friends/all")
async def get_current_user_friends(
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
    user_id: str | None = None,
) -> list[BaseUserModel]:
    return await user_service.get_friends(user_id if user_id else user.id)


@router.get("/friends/{friend_id}")
async def check_is_friend_or_not(
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> bool:
    return await user_service.check_friend(user.id, friend_id)


@router.post("/friends/add/{friend_id}")
async def add_friend(
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> dict[str, str]:
    await user_service.add_friend(user.id, friend_id)
    return {
        "detail": f"Пользователь {user.id} успешно добавил {friend_id} в друзья"
    }


@router.delete("/friends/remove/{friend_id}")
async def remove_friend(
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> dict[str, str]:
    await user_service.remove_friend(user.id, friend_id)
    return {
        "detail": f"Пользователь {user.id} успешно удалил {friend_id} из друзей"
    }


@router.put("/")
async def update_user_profile(
    user_service: Annotated[UserService, Depends(get_user_service)],
    id: str | None = Form(default=None),
    username: str | None = Form(default=None),
    email: str | None = Form(default=None),
    avatar: UploadFile | None = Form(default=None),
    city: str | None = Form(default=None),
    description: str | None = Form(default=None),
    birthday: datetime | None = Form(default=None),
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> BaseUserModel:
    return await user_service.update_user_profile(
        user.id,
        UpdateUserModel(
            id=id,
            username=username,
            email=email,
            avatar=avatar,
            city=city,
            description=description,
            birthday=birthday,
        ),
    )
