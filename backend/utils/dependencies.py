from fastapi import Depends
from sqlalchemy.ext.asyncio.session import AsyncSession

import services
import repositories
from database.connection import engine

async def get_session():
    session = AsyncSession(bind=engine)
    try:
        yield session
    finally:
        await session.close()
        

async def get_auth_service(session=Depends(get_session)):
    return services.AuthService(repository=repositories.UserRepository(session=session))

async def get_post_service(session=Depends(get_session)):
    return services.PostService(repository=repositories.PostRepository(session=session))

async def get_user_service(session=Depends(get_session)):
    return services.UserService(repository=repositories.UserRepository(session=session))