from datetime import datetime
from typing import Annotated
from uuid import uuid4
from pydantic import UUID4

from fastapi import APIRouter, Depends, UploadFile, File, Body, Form

from backend.dto.comment_dto import CommentModel
from backend.dto.post_dto import PostModel
from starlette.requests import Request
from backend.services.comment_service import CommentService
from backend.utils.dependencies import get_comment_service, get_post_service, get_user_service
from backend.services import PostService, UserService, user_service


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
) -> PostModel:
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
) -> PostModel:
    return await post_service.get_one_post(post_id)


@router.patch('/{post_id}/like/{user_id}')
async def like_post(
    post_id: UUID4,
    user_id: str,
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)]
) -> PostModel:
    user = await user_service.get_user(user_id)
    return await post_service.like_post(post_id, user)


@router.delete('/{post_id}')
async def delete_post(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)]
) -> bool:
    await post_service.delete_post(post_id)
    return True


@router.get('/{post_id}/comments')
async def get_post_comments(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)]
) -> list[CommentModel]:
    return await post_service.get_comments(post_id)


@router.post('{post_id}/comments/add')
async def add_comment_to_post(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    comment_service: Annotated[CommentService, Depends(get_comment_service)],
    text: str = Form(),
    created_at: datetime = Form(default=datetime.now()),
    author: str = Form(),
    images: list[UploadFile] = Form(default=[""]),
    parent: int | None = Form(default=None)
):
    comment = await comment_service.add_comment(
        text=text,
        created_at=created_at,
        author=await user_service.get_user(author),
        images=images,
        parent=parent
    )
    return await post_service.add_comment(post_id, comment)