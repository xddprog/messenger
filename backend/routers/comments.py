from typing import Annotated
from fastapi import APIRouter, Depends, Form, UploadFile

from backend.services.comment_service import CommentService
from backend.utils.dependencies.dependencies import get_comment_service


router = APIRouter(tags=["comments"], prefix="/comments")


@router.delete("/{comment_id}/delete")
async def delete_post_comment(
    comment_id: int,
    comment_service: Annotated[CommentService, Depends(get_comment_service)],
) -> dict:
    await comment_service.delete_post_comment(comment_id)
    return {"detail": "Комментарий удален"}


@router.post("/{comment_id}/like")
async def like_comment():
    pass


@router.post("/{comment_id}/update")
async def update_comment(
    comment_id: int,
    comment_service: Annotated[CommentService, Depends(get_comment_service)],
    text: str | None = Form(default=None),
    new_images: list[UploadFile] | None = Form(default=None),
    deleted_images: list[UploadFile] | None = Form(default=None),
):
    return await comment_service.update_post_comment(
        comment_id, text, new_images, deleted_images
    )
