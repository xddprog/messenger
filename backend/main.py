from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.utils.dependencies.dependencies import (
    get_current_user_dependency,
)
from backend.utils.config.config import (
    load_database_config,
    load_redis_config,
    load_s3_storage_config,
)
from backend.database.connection import DatabaseConnection
from backend.routers import (
    auth_router,
    posts_router,
    users_router,
    chats_router,
    comment_router,
    group_router,
)
from backend.utils.redis_cache import RedisCache
from backend.utils.s3_client import S3Client
from backend.utils.websockets.chats_manager import ChatsManager
from backend.utils.websockets.notification_manager import NotificationsManager


async def lifespan(app: FastAPI):
    app.state.redis_cache = await RedisCache(config=load_redis_config())()
    app.state.notifications_manager = NotificationsManager()
    app.state.chats_manager = ChatsManager()
    app.state.db_connection = await DatabaseConnection(load_database_config())()
    app.state.s3_client = await S3Client(load_s3_storage_config())()

    yield


app = FastAPI(lifespan=lifespan)


PROTECTED = Depends(get_current_user_dependency)


origins = [
    "http://localhost:5173",
    "https://messenger-five-blush.vercel.app",
    "https://messenger-xddprogs-projects.vercel.app",
    "https://messenger-git-main-xddprogs-projects.vercel.app",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(users_router, dependencies=[])
app.include_router(chats_router, dependencies=[])
app.include_router(posts_router, dependencies=[PROTECTED])
app.include_router(comment_router, dependencies=[PROTECTED])
app.include_router(group_router, dependencies=[PROTECTED])


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    try:
        errors = []

        for error in exc.errors():
            field = error["loc"]
            input = error["input"]
            message = error["msg"]

            if isinstance(input, dict):
                input = input.get(field[-1])

            errors.append(
                {
                    "location": " -> ".join(field),
                    "detail": message,
                    "input": input,
                }
            )

        return JSONResponse(content=errors, status_code=422)
    except TypeError:
        return JSONResponse(status_code=422, content={"detail": "invalid json"})
