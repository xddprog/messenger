from typing import Annotated
from pydantic import UUID4

from fastapi import APIRouter, Depends, UploadFile, File, Body, Form

from backend.dto.post_dto import PostModel
from starlette.requests import Request
from backend.utils.dependencies import get_post_service, get_user_service
from backend.services import PostService, UserService


router = APIRouter(
    prefix='/api/posts',
    tags=['posts'],
)


@router.post('/create', status_code=201)
async def create_post(
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    request: Request,
    author: str = Form(...),
    description: str = Form(...),
    images: list = Form(default=[""]),
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


@router.get('/{post_id}')
async def get_one_post(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)]
):
    return await post_service.get_one_post(post_id)


@router.patch('/{post_id}/like/{user_id}')
async def like_post(
    post_id: UUID4,
    user_id: str,
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    user = await user_service.get_user(user_id)
    return await post_service.like_post(post_id, user)


@router.delete('/{post_id}')
async def delete_post(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)]
):
    await post_service.delete_post(post_id)
    return True
