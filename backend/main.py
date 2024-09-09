from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import uvicorn
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.utils.dependencies import get_current_user_dependency
from backend.utils.websocket_manager import WebSocketManager
from backend.utils.redis_cache import RedisCache
from backend.utils.config.config import load_redis_config
from backend.database.connection import create_tables
from backend.routers import (
    auth_router,
    posts_router,
    users_router,
    chats_router,
)


async def lifespan(app: FastAPI):
    app.state.redis_cache = RedisCache(config=load_redis_config())
    app.state.websocket_manager = WebSocketManager()
    await create_tables()
    yield
    # app.state.redis_cache.close()


app = FastAPI(lifespan=lifespan)


PROTECTED = Depends(get_current_user_dependency)


origins = ["http://localhost:5173", "http://127.0.0.1"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(users_router, dependencies=[PROTECTED])
app.include_router(chats_router)
app.include_router(posts_router, dependencies=[PROTECTED])


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
        return JSONResponse(
            status_code=422, content={"detail": "invalid json"}
        )


if __name__ == "__main__":
    uvicorn.run(app, port=5000)
