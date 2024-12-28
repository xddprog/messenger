from typing import Annotated
from uuid import uuid4
from fastapi import Depends, Form, UploadFile
from fastapi.routing import APIRouter
from pydantic import UUID4

from backend.dto.group_dto import GroupInfoModel, UpdateGroupForm
from backend.dto.user_dto import BaseUserModel
from backend.services.group_service import GroupService
from backend.services.post_service import PostService
from backend.services.user_service import UserService
from backend.utils.dependencies.dependencies import (
    get_current_user_dependency,
    get_group_service,
    get_post_service,
    get_user_service,
)


router = APIRouter(prefix="/api/groups", tags=["groups"])


@router.get("/all")
async def get_all_groups(
    group_service: Annotated[GroupService, Depends(get_group_service)],
):
    return await group_service.get_all_groups()


@router.get("/{group_id}")
async def get_one_group(
    group_id: str,
    group_service: Annotated[GroupService, Depends(get_group_service)],
    user_id: Annotated[str, Depends(get_current_user_dependency)]
):
    return await group_service.get_one_group(group_id, user_id)


@router.get('/{group_id}/subscribers')
async def get_group_subscribers(
    group_id: str,
    group_service: Annotated[GroupService, Depends(get_group_service)],
    user_id: Annotated[str, Depends(get_current_user_dependency)]
):
    return await group_service.get_subscribers(group_id)


@router.post("/create", status_code=201)
async def add_group(
    group_service: Annotated[GroupService, Depends(get_group_service)],
    creator_id: Annotated[str, Depends(get_current_user_dependency)],
    group_id: UUID4 = Form(..., default_factory=lambda: str(uuid4())),
    title: str = Form(...),
    avatar: UploadFile | None = Form(default=None),
    cover: UploadFile | None = Form(default=None),
    description: str = Form(),
):
    return await group_service.create_group(
        title=title,
        description=description,
        group_id=group_id,
        avatar=avatar,
        cover=cover,
        creator=creator_id,
    )


@router.delete("/{group_id}")
async def delete_group(
    group_id: str,
    group_service: Annotated[GroupService, Depends(get_group_service)],
):
    await group_service.delete_group(group_id)
    return {"message": "Группа удалена"}


@router.patch("/{group_id}/join")
async def join_user_to_group(
    group_id: str,
    group_service: Annotated[GroupService, Depends(get_group_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    user_id: Annotated[str, Depends(get_current_user_dependency)],
):
    return await group_service.join_user_to_group(group_id, user_id)


@router.put('/{group_id}')
async def update_group(
    group_id: str,
    group_service: Annotated[GroupService, Depends(get_group_service)],
    title: str | None = Form(default=None),
    description: str | None = Form(default=None),
    avatar: UploadFile | None = Form(default=None),
):
    return await group_service.update_group(
        group_id=group_id, 
        form=UpdateGroupForm(
            title=title,
            description=description,
            avatar=avatar
        )
    )


@router.get('/{group_id}/posts')
async def get_group_posts(
    group_id: str,
    group_service: Annotated[GroupService, Depends(get_group_service)],
):
    return await group_service.get_group_posts(group_id)


@router.post('/{group_id}/posts/create')
async def create_post(
    group_service: Annotated[GroupService, Depends(get_group_service)],
    group_id: str,
    post_service: Annotated[PostService, Depends(get_post_service)],
    author_id: Annotated[str, Depends(get_current_user_dependency)],
    post_id: UUID4 = Form(default_factory=lambda: str(uuid4())),
    description: str = Form(...),
    images: list = Form(default=[""]),
):
    await group_service.check_group_exist(group_id)
    return await post_service.create_post(
        post_id=post_id, 
        description=description, 
        images=images, 
        author=author_id,
        group_id=group_id
    )