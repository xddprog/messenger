import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

import routers
from database.connection import create_tables
from utils.dependencies import get_session


async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(
    lifespan=lifespan
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
)


app.include_router(routers.auth_router)
app.include_router(routers.posts_router)


if __name__ == "__main__":
    uvicorn.run(app, port=5000)
