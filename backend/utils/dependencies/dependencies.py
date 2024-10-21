from typing import Annotated, AsyncGenerator

from fastapi import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio.session import AsyncSession
from starlette.requests import HTTPConnection

import backend.services as services
import backend.repositories as repositories
from backend.dto.user_dto import BaseUserModel
from backend.services import AuthService
from backend.utils.redis_cache import RedisCache
from backend.utils.s3_client import S3Client
from backend.utils.websockets.notification_manager import NotificationsManager
# from functools import wraps
# from time import perf_counter
# from typing import AsyncGenerator, Callable, TypeVar, Any, Awaitable, Union

bearer = HTTPBearer(auto_error=False)


# R = TypeVar("R")

# def measure_execution_time(func: Callable[..., Union[Awaitable[R], AsyncGenerator[Any, None]]]) -> Callable[..., Union[Awaitable[R], AsyncGenerator[Any, None]]]:
#     @wraps(func)
#     async def wrapper(*args: Any, **kwargs: Any) -> Union[R, AsyncGenerator[Any, None]]:
#         start_time = perf_counter()

#         if func.__name__ == 'get_s3_client' or func.__name__ == 'get_session':
#             async def generator_wrapper() -> AsyncGenerator[Any, None]:

#                 async for value in func(*args, **kwargs):
#                     yield value

#                 process_time = perf_counter() - start_time
#                 print(f"Execution time of {func.__name__}: {process_time} seconds")

#             return generator_wrapper()

#         else:
#             result = await func(*args, **kwargs)
#             process_time = perf_counter() - start_time
#             print(f"Execution time of {func.__name__}: {process_time:.4f} seconds")
#             return result

#     return wrapper


async def get_session(
    request: HTTPConnection,
) -> AsyncGenerator[AsyncSession, None]:
    session = await request.app.state.db_connection.get_session()
    try:
        yield session
    finally:
        await session.close()


async def get_redis(request: HTTPConnection) -> RedisCache:
    return request.app.state.redis_cache


async def get_notifications_manager(
    websocket: HTTPConnection,
) -> NotificationsManager:
    return websocket.app.state.notifications_manager


async def get_chats_manager(websocket: HTTPConnection) -> NotificationsManager:
    return websocket.app.state.chats_manager


async def get_s3_client(request: HTTPConnection) -> S3Client:
    return request.app.state.s3_client


async def get_auth_service(
    session=Depends(get_session), s3_client=Depends(get_s3_client)
):
    return services.AuthService(
        repository=repositories.UserRepository(session=session),
        s3_client=s3_client,
    )


async def get_comment_service(
    session=Depends(get_session), s3_client=Depends(get_s3_client)
):
    return services.CommentService(
        repository=repositories.CommentRepository(session=session),
        s3_client=s3_client,
    )


async def get_current_user_dependency(
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    token: Annotated[HTTPBearer, Depends(bearer)],
) -> BaseUserModel:
    email = await auth_service.verify_token(token)
    return await auth_service.check_user_exist(email)


async def get_post_service(
    session=Depends(get_session), s3_client=Depends(get_s3_client)
):
    return services.PostService(
        repository=repositories.PostRepository(session=session),
        s3_client=s3_client,
    )


async def get_user_service(
    session=Depends(get_session), s3_client=Depends(get_s3_client)
):
    return services.UserService(
        repository=repositories.UserRepository(session=session),
        s3_client=s3_client,
    )


async def get_chat_service(
    session=Depends(get_session), s3_client=Depends(get_s3_client)
):
    return services.ChatService(
        repository=repositories.ChatRepository(session=session),
        s3_client=s3_client,
    )


async def get_message_service(
    session=Depends(get_session), s3_client=Depends(get_s3_client)
):
    return services.MessageService(
        repository=repositories.MessageRepository(session=session),
        s3_client=s3_client,
    )


async def get_group_service(
    session=Depends(get_session), s3_client=Depends(get_s3_client)
):
    return services.GroupService(
        repository=repositories.GroupRepository(session=session),
        s3_client=s3_client,
    )


async def get_notification_service(
    session=Depends(get_session), s3_client=Depends(get_s3_client)
):
    return services.NotificationService(
        repository=repositories.NotificationRepository(session=session),
        s3_client=s3_client,
    )
