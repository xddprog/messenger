import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from backend.utils.dependencies import get_current_user_dependency
from backend.utils.websocket_manager import WebSocketManager
from backend.utils.redis_cache import RedisCache
from backend.utils.config.config import load_redis_config
from database.connection import create_tables
from routers import (
    auth_router, posts_router, users_router,
    chats_router
)


async def lifespan(app: FastAPI):
    app.state.redis_cache = RedisCache(config=load_redis_config())
    app.state.websocket_manager = WebSocketManager()
    await create_tables()
    yield
    # app.state.redis_cache.close()


app = FastAPI(
    lifespan=lifespan
)


PROTECTED = Depends(get_current_user_dependency)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(users_router, dependencies=[PROTECTED])
app.include_router(chats_router, dependencies=[PROTECTED])
app.include_router(posts_router, dependencies=[PROTECTED])
