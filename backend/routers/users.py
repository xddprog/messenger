from datetime import datetime
import json
from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    Form,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)

from backend.dto.group_dto import BaseGroupModel
from backend.dto.notification_dto import BaseNotificationModel
from backend.dto.post_dto import PostModel
from backend.dto.user_dto import BaseUserModel, UpdateUserModel
from backend.services.group_service import GroupService
from backend.services.notification_service import NotificationService
from backend.services.post_service import PostService
from backend.utils.config.enums import NotificationType
from backend.dto.chat_dto import BaseChatModel
from backend.services import UserService, ChatService
from backend.utils.dependencies.dependencies import (
    get_current_user_dependency,
    get_group_service,
    get_notification_service,
    get_notifications_manager,
    get_post_service,
    get_redis,
    get_user_service,
    get_chat_service,
)
from backend.utils.redis_cache import RedisCache
from backend.utils.websockets.notification_manager import NotificationsManager


router = APIRouter(prefix="/api/user", tags=["users"])


@router.get("/search")
async def search_users(
    username: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    redis_cache: Annotated[RedisCache, Depends(get_redis)],
) -> list[BaseUserModel]:
    users = await redis_cache.get_item(username)

    if not users:
        users = await user_service.search_users(username, "")
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
    chats_models = [
        await chats_service.get_chat(chat_id, dump=True) for chat_id in chats
    ]
    return chats_models


@router.get("/posts")
async def get_user_posts(
    user_service: Annotated[UserService, Depends(get_user_service)],
    post_service: Annotated[PostService, Depends(get_post_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
    user_id: str = None,
) -> list[PostModel]:
    posts = await user_service.get_user_posts(user_id if user_id else user.id)
    return [await post_service.get_one_post(post_id) for post_id in posts]


@router.get("/notifications/unreaded")
async def get_user_notifications(
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
    limit: int = 5,
    offset: int = 0,
) -> list[BaseNotificationModel]:
    return await user_service.get_user_unreaded_notifications(
        user.id, limit, offset
    )


@router.get("/{user_id}")
async def get_user(
    user_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    notification_service: Annotated[
        NotificationService, Depends(get_notification_service)
    ],
    current_user: BaseUserModel = Depends(get_current_user_dependency),
) -> dict:
    return {
        "current_user": await user_service.get_user(user_id, dump=True),
        "request_add_friend_is_send": await notification_service.check_request_add_friend(
            current_user.id, user_id
        ),
        "request_add_friend_is_get": await notification_service.check_request_add_friend_is_get(
            user_id, current_user.id
        ),
        "is_friend": await user_service.check_friend(current_user.id, user_id),
    }


@router.get("/friends/all")
async def get_current_user_friends(
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
    user_id: str | None = None,
) -> list[BaseUserModel]:
    return await user_service.get_friends(user_id if user_id else user.id)


@router.post("/friends/add/{friend_id}/request")
async def add_friend_request(
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    notification_service: Annotated[
        NotificationService, Depends(get_notification_service)
    ],
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> dict[str, str]:
    friend = await user_service.get_user(friend_id, check_exists=True)
    await notification_service.create_notification(
        user=await user_service.get_user(user.id),
        notification_sender_id=friend_id,
        notification_sender_name=friend.username,
        message=f"{user.username} хочет добавить вас в друзья",
        notification_type=NotificationType.ADD_FRIEND,
    )
    return {
        "detail": f"Запрос на добавление в друзья отправлен пользователю {user.username}"
    }


@router.post("/friends/add/{friend_id}/accept")
async def add_friend_accept(
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    notification_service: Annotated[
        NotificationService, Depends(get_notification_service)
    ],
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> dict[str, str]:
    await user_service.add_friend(user.id, friend_id)
    return {"detail": "Пользователь добавлен в друзья"}


@router.delete("/friends/remove/{friend_id}")
async def remove_friend(
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> dict[str, str]:
    await user_service.remove_friend(user.id, friend_id)
    return {"detail": "Вы удалили пользователя из друзей"}


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


@router.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str,
    manager: Annotated[
        NotificationsManager, Depends(get_notifications_manager)
    ],
    user_service: Annotated[UserService, Depends(get_user_service)],
    notification_service: Annotated[
        NotificationService, Depends(get_notification_service)
    ],
):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            current_user = await user_service.get_user(user_id, dump=True)

            if data["type"] == NotificationType.ADD_FRIEND.value:
                send_to_user = await user_service.get_user(data["friend_id"])
                new_notification = await notification_service.create_notification(
                    user=send_to_user,
                    notification_sender_id=data["notification_sender_id"],
                    notification_sender_name=data["notification_sender_name"],
                    message=f"{data['notification_sender_name']} хочет добавить вас в друзья",
                    image=current_user.avatar,
                    notification_type=NotificationType.ADD_FRIEND.value,
                )
            elif data["type"] == NotificationType.ADD_FRIEND_ACCEPT.value:
                await notification_service.delete_notification(
                    data["friend_id"],
                    data["notification_sender_id"],
                    NotificationType.ADD_FRIEND.value,
                )
                send_to_user = await user_service.get_user(data["friend_id"])
                new_notification = await notification_service.create_notification(
                    user=send_to_user,
                    notification_sender_id=data["notification_sender_id"],
                    notification_sender_name=data["notification_sender_name"],
                    message=f"{data['notification_sender_name']} принял ваш запрос на добавление в друзья",
                    image=current_user.avatar,
                    notification_type=NotificationType.ADD_FRIEND_ACCEPT.value,
                )
            elif data["type"] == NotificationType.REMOVE_FRIEND.value:
                await notification_service.delete_notification(
                    data["friend_id"],
                    data["notification_sender_id"],
                    NotificationType.ADD_FRIEND_ACCEPT.value,
                )
                new_notification = BaseNotificationModel(
                    notification_sender_id=data["notification_sender_id"],
                    notification_sender_name=data["notification_sender_name"],
                    message=f"{data['notification_sender_name']} удалил вас из друзей",
                    image=current_user.avatar,
                    notification_type=NotificationType.REMOVE_FRIEND.value,
                    is_read=False,
                )
            await manager.send_notification(data["friend_id"], new_notification)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
