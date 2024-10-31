from typing import Annotated
from uuid import uuid4
from fastapi import Depends, Form, UploadFile
from fastapi.routing import APIRouter
from pydantic import UUID4

from backend.dto.user_dto import BaseUserModel
from backend.services.group_service import GroupService
from backend.services.user_service import UserService
from backend.utils.dependencies.dependencies import (
    get_current_user_dependency,
    get_group_service,
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
):
    return await group_service.get_one_group(group_id)


@router.post("/create", status_code=201)
async def add_group(
    user_service: Annotated[UserService, Depends(get_user_service)],
    group_service: Annotated[GroupService, Depends(get_group_service)],
    id: UUID4 = Form(..., default_factory=lambda: str(uuid4())),
    title: str = Form(...),
    avatar: UploadFile | None = Form(default=None),
    cover: UploadFile | None = Form(default=None),
    description: str = Form(),
    creator: BaseUserModel = Depends(get_current_user_dependency),
):
    creator = await user_service.get_user(creator.id)
    return await group_service.create_group(
        title=title,
        description=description,
        id=id,
        avatar=avatar,
        cover=cover,
        creator=creator,
    )


@router.delete("/{group_id}")
async def delete_group(
    group_id: int,
    group_service: Annotated[GroupService, Depends(get_group_service)],
):
    await group_service.delete_group(group_id)
    return {"message": "Группа удалена"}


@router.patch("/{group_id}/join")
async def join_user_to_group(
    group_id: int,
    group_service: Annotated[GroupService, Depends(get_group_service)],
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: BaseUserModel = Depends(get_current_user_dependency),
):
    user = await user_service.get_user(user.id)
    return await group_service.join_user_to_group(group_id, user)
