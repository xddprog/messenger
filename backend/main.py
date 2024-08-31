import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

import routers
from database.connection import create_tables


async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(
    lifespan=lifespan
)


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

for router in routers.routers:
    app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(app, port=5000)
