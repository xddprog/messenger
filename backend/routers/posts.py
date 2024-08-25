from typing import Annotated
from fastapi import APIRouter, Depends, UploadFile, File, Body, Form

from dto.post_dto import PostModel
from pydantic import UUID4
from starlette.requests import Request
from utils.dependencies import get_post_service, get_user_service
from services import PostService, UserService


router = APIRouter(
    prefix='/api/posts',
    tags=['posts'],
)


@router.post('/create')
async def create_post(
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    images: list[UploadFile] = File(...),
    author: UUID4 = Form(...),
    description: str = Form(...)
):
    author = await user_service.get_user(author)
    new_post = await post_service.create_post(
        description=description,
        images=images,
        author=author
    )
    return new_post


@router.get('/all')
async def get_all_posts(
    post_service: Annotated[PostService, Depends(get_post_service)]
) -> list[PostModel]:
    return await post_service.get_all_posts()


@router.patch('/{post_id}/like/{user_id}')
async def like_post(
    post_id: UUID4,
    user_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    user = await user_service.get_user(user_id)
    return await post_service.like_post(post_id, user)
