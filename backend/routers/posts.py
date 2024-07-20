from typing import Annotated
from fastapi import APIRouter, Depends

from dto.post_dto import CreatePostModel, PostModel
from utils.dependencies import get_post_service, get_user_service
from services import PostService, UserService


router = APIRouter(
    prefix='/api/posts',
    tags=['posts']
)


@router.post('/create')
async def create_post(
    form: CreatePostModel,
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)]
) -> PostModel:
    form.author = await user_service.get_user(form.author)
    new_post = await post_service.create_post(form)

    return await post_service.model_dump(new_post, PostModel)


@router.get('/all')
async def get_all_posts(
    post_service: Annotated[PostService, Depends(get_post_service)]
) -> list[PostModel]:
    return await post_service.get_all_posts()