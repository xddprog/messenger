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
from starlette.responses import JSONResponse

from backend.dto.group_dto import BaseGroupModel
from backend.dto.notification_dto import BaseNotificationModel
from backend.dto.post_dto import PostModel
from backend.dto.user_dto import BaseUserModel, GetUserDataModel, UpdateUserModel
from backend.services.group_service import GroupService
from backend.services.notification_service import NotificationService
from backend.services.post_service import PostService
from backend.utils.config.enums import NotificationType
from backend.dto.chat_dto import BaseChatModel
from backend.services import UserService, ChatService
from backend.utils.decorators.cache_decorators import CacheUsersSearch
from backend.utils.dependencies.dependencies import (
    get_current_user_dependency,
    get_group_service,
    get_notification_service,
    get_notifications_manager,
    get_post_service,
    get_user_service,
    get_chat_service,
)
from backend.utils.clients.redis_client import RedisCache
from backend.utils.websockets.notification_manager import NotificationsManager


router = APIRouter(prefix="/api/user", tags=["users"])


@router.get("/search")
@CacheUsersSearch()
async def search_users(
    username: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
) -> list[BaseUserModel]:
    users = await user_service.search_users(username, user)
    return users


@router.get("/groups")
async def get_user_groups(
    group_service: Annotated[GroupService, Depends(get_group_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
    user_admined_groups: bool = False,
    user_id: str = None,
) -> list[BaseGroupModel]:
    
    if user_admined_groups:
        return await group_service.get_user_admined_groups(user.id)
    return await group_service.get_user_groups(user_id if user_id else user)


@router.get("/chats")
async def get_user_chats(
    user_service: Annotated[UserService, Depends(get_user_service)],
    chats_service: Annotated[ChatService, Depends(get_chat_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
) -> list[BaseChatModel]:
    chats = await user_service.get_user_chats(user)
    chats_models = [
        await chats_service.get_chat(chat_id, dump=True) for chat_id in chats
    ]
    return chats_models


@router.get("/posts")
async def get_user_posts(
    post_service: Annotated[PostService, Depends(get_post_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
) -> list[PostModel]:
    return await post_service.get_user_posts(user)


@router.get("/notifications/unreaded")
async def get_user_notifications(
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
    limit: int = 5,
    offset: int = 0,
) -> list[BaseNotificationModel]:
    return await user_service.get_user_unreaded_notifications(
        user, limit, offset
    )


@router.get("/{user_id}")
async def get_user(
    user_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    notification_service: Annotated[
        NotificationService, Depends(get_notification_service)
    ],
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> dict:
    return GetUserDataModel(
        current_user=await user_service.get_user(user_id, dump=True),
        request_add_friend_is_send=await notification_service.check_request_add_friend(
            user, user_id
        ),
        request_add_friend_is_get=await notification_service.check_request_add_friend_is_get(
            user_id, user
        ),
        is_friend=await user_service.check_friend(user, user_id),
    )


@router.get("/friends/all")
async def get_current_user_friends(
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
    user_id: str | None = None,
) -> list[BaseUserModel]:
    return await user_service.get_friends(user_id if user_id else user)


@router.post("/friends/add/{friend_id}/accept")
async def add_friend_accept(
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
) -> dict[str, str]:
    await user_service.add_friend(user, friend_id)
    return {"detail": "Пользователь добавлен в друзья"}


@router.delete("/friends/remove/{friend_id}")
async def remove_friend(
    friend_id: str,
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
) -> dict[str, str]:
    await user_service.remove_friend(user, friend_id)
    return {"detail": "Вы удалили пользователя из друзей"}


@router.put("/")
async def update_user_profile(
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: Annotated[str, Depends(get_current_user_dependency)],
    id: str | None = Form(default=None),
    username: str | None = Form(default=None),
    email: str | None = Form(default=None),
    avatar: UploadFile | None = Form(default=None),
    city: str | None = Form(default=None),
    description: str | None = Form(default=None),
    birthday: datetime | None = Form(default=None),
) -> BaseUserModel:
    return await user_service.update_user_profile(
        user_id=user,
        form=UpdateUserModel(
            id=id,
            username=username,
            email=email,
            avatar=avatar,
            city=city,
            description=description,
            birthday=birthday,
        ),
    )


@router.websocket("/ws/notifications")
async def websocket_endpoint(
    websocket: WebSocket,
    user: Annotated[str, Depends(get_current_user_dependency)],
    manager: Annotated[
        NotificationsManager, Depends(get_notifications_manager)
    ],
    user_service: Annotated[UserService, Depends(get_user_service)],
    notification_service: Annotated[
        NotificationService, Depends(get_notification_service)
    ],
):
    await manager.connect(user, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            current_user = await user_service.get_user(user, dump=True)

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
        manager.disconnect(user)
