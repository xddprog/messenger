from fastapi import APIRouter
from backend.versions.v1.routers.auth import router as auth_router
from backend.versions.v1.routers.posts import router as posts_router
from backend.versions.v1.routers.chats import router as chats_router
from backend.versions.v1.routers.users import router as users_router
from backend.versions.v1.routers.comments import router as comments_router
from backend.versions.v1.routers.groups import router as groups_router


v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(auth_router)
v1_router.include_router(posts_router)
v1_router.include_router(chats_router)
v1_router.include_router(users_router)
v1_router.include_router(comments_router)
v1_router.include_router(groups_router)