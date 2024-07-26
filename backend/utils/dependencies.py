from typing import Annotated

from fastapi import Depends, Cookie
from sqlalchemy.ext.asyncio.session import AsyncSession
from aiobotocore.session import AioSession

import services
import repositories
from database.connection import engine
from dto.user_dto import BaseUserModel
from services import AuthService

from utils.config.config import load_s3_storage_config
from utils.s3_client import S3Client
from utils.websocket_manager import WebSocketManager


async def get_session():
    session = AsyncSession(bind=engine)
    try:
        yield session
    finally:
        await session.close()


async def get_s3_client():
    config = load_s3_storage_config()
    session = AioSession()
    async with session.create_client(
        's3',
        aws_access_key_id=config.access_key_id,
        aws_secret_access_key=config.secret_access_key,
        endpoint_url=config.endpoint_url,
        region_name=config.region
    ) as client:
        yield S3Client(
            client=client,
            bucket_name=config.bucket_name,
            endpoint_url=config.endpoint_url
        )

#
# async def get_websocket_manager():
#     return WebSocketManager()
#

async def get_auth_service(session=Depends(get_session)):
    return services.AuthService(repository=repositories.UserRepository(session=session))


async def get_current_user_dependency(
        auth_service: Annotated[AuthService, Depends(get_auth_service)],
        token=Cookie(default=None),
) -> BaseUserModel:
    username = await auth_service.verify_token(token)
    return await auth_service.check_user_exist(username)


async def get_post_service(session=Depends(get_session), s3_client=Depends(get_s3_client)):
    return services.PostService(
        repository=repositories.PostRepository(session=session),
        s3_client=s3_client
    )


async def get_user_service(session=Depends(get_session)):
    return services.UserService(repository=repositories.UserRepository(session=session))


async def get_chat_service(session=Depends(get_session)):
    return services.ChatService(repository=repositories.ChatRepository(session=session))


async def get_message_service(session=Depends(get_session)):
    return services.MessageService(repository=repositories.MessageRepository(session=session))
