from routers.auth import router as auth_router
from routers.posts import router as posts_router
from routers.chats import router as chats_router
from routers.users import router as users_router
from routers.friends import router as friends_router

routers = [auth_router, posts_router, chats_router, users_router, friends_router]
