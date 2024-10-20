from datetime import datetime
from typing import Annotated
from uuid import uuid4
from pydantic import UUID4

from fastapi import APIRouter, Depends, UploadFile, Form

from backend.dto.comment_dto import CommentModel
from backend.dto.post_dto import PostModel
from backend.dto.user_dto import BaseUserModel
from backend.services.comment_service import CommentService
from backend.utils.dependencies.dependencies import (
    get_comment_service,
    get_current_user_dependency,
    get_post_service,
    get_user_service,
)
from backend.services import PostService, UserService


router = APIRouter(
    prefix="/api/posts",
    tags=["posts"],
)


@router.post("/create", status_code=201)
async def create_post(
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    id: UUID4 = Form(default_factory=lambda: str(uuid4())),
    description: str = Form(...),
    images: list = Form(default=[""]),
    author: BaseUserModel = Depends(get_current_user_dependency),
) -> PostModel:
    print(images[0].file)
    author = await user_service.get_user(author.id)
    new_post = await post_service.create_post(
        post_id=id, description=description, images=images, author=author
    )
    return new_post


@router.get("/all")
async def get_all_posts(
    post_service: Annotated[PostService, Depends(get_post_service)],
) -> list[PostModel]:
    return await post_service.get_all_posts()


@router.get("/{post_id}")
async def get_one_post(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)],
) -> PostModel:
    return await post_service.get_one_post(post_id)


@router.patch("/{post_id}/like")
async def like_post(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
) -> PostModel:
    user = await user_service.get_user(user.id)
    return await post_service.like_post(post_id, user)


@router.delete("/{post_id}")
async def delete_post(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)],
) -> dict[str, str]:
    await post_service.delete_post(post_id)
    return {"detail": "Пост удален"}


@router.get("/{post_id}/comments")
async def get_post_comments(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)],
    comment_service: Annotated[CommentService, Depends(get_comment_service)],
) -> list[CommentModel]:
    await post_service.check_post_exist(post_id)
    return await comment_service.get_post_comments(post_id)


@router.post("{post_id}/comments/add")
async def add_comment_to_post(
    post_id: UUID4,
    post_service: Annotated[PostService, Depends(get_post_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    comment_service: Annotated[CommentService, Depends(get_comment_service)],
    text: str = Form(),
    created_at: datetime = Form(default=datetime.now()),
    images: list[UploadFile] = Form(default=[]),
    parent: int | None = Form(default=None),
    author: BaseUserModel = Depends(get_current_user_dependency),
) -> CommentModel:
    comment = await comment_service.add_comment(
        post_id=post_id,
        text=text,
        created_at=created_at,
        author=await user_service.get_user(author.id),
        images=images,
        parent=parent,
    )
    return await post_service.add_comment(post_id, comment)
