import asyncio
import json
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.services.message_service import MessageService
from backend.utils.clients.rabbit_client import RabbitClient
from backend.database.connection import DatabaseConnection
from backend.versions.dependencies import get_message_service
from backend.versions.v1.routers import v1_router
from backend.utils.clients.redis_client import RedisCache
from backend.utils.clients.s3_client import S3Client
from backend.utils.websockets.chats_manager import ChatsManager
from backend.utils.websockets.notification_manager import NotificationsManager


async def handle_chat(
    rabbit_client: RabbitClient,
    chat_manager: ChatsManager,
    message_service: MessageService,
):
    queue = await rabbit_client.declare_queue("chats")
    async with queue.iterator() as messages:
        async for message in messages:
            async with message.process():
                data = json.loads(message.body)
                type_ = data.get("type")
                chat_id = data.get("chat_id")
                client_id = data.get("client_id")
                message_id = data.get("message_id")
                try:
                    message = await message_service.handle_message_in_websocket(
                        type_, chat_id, client_id, message_id, data
                    )
                    await chat_manager.broadcast_message(
                        chat_id, type_, message.model_dump()
                    )
                except HTTPException as error:
                    await chat_manager.broadcast_error(chat_id, error)
                except Exception as error:
                    pass


async def lifespan(app: FastAPI):
    app.state.notifications_manager = NotificationsManager()
    app.state.chats_manager = ChatsManager()
    app.state.db_connection = await DatabaseConnection()()
    app.state.s3_client = await S3Client()()
    app.state.rabbit_client = await RabbitClient()()
    asyncio.create_task(
        handle_chat(
            app.state.rabbit_client,
            app.state.chats_manager,
            await get_message_service(
                await app.state.db_connection.get_session(),
                app.state.s3_client,
            ),
        )
    )
    yield
    await app.state.rabbit_client.close()


app = FastAPI(lifespan=lifespan)


origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(v1_router)


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
