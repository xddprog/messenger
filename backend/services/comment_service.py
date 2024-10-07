from datetime import datetime
from uuid import uuid4
from fastapi import UploadFile
from pydantic import UUID4
from backend.database.models import Comment, User
from backend.dto.comment_dto import CommentModel
from backend.errors.comment_errors import CommentNotFound
from backend.repositories import CommentRepository
from backend.services.base_service import BaseService


class CommentService(BaseService):
    repository: CommentRepository

    # async def get_comment_images_url()

    async def add_comment(
        self,
        post_id: UUID4,
        text: str,
        created_at: datetime,
        author: User,
        images: list[UploadFile] | list[str],
        parent: int | None,
    ) -> Comment:
        if parent:
            parent = await self.repository.get_item(parent)

        if images:
            images = await self.s3_client.upload_many_files(
                images, f"posts/{post_id}/comments/{author.id}/{uuid4()}"
            )

        return await self.repository.add_item(
            text=text,
            created_at=created_at,
            author=author,
            images=images,
            parent=parent,
        )

    async def get_post_comments(self, post_id: UUID4) -> list[CommentModel]:
        comments = await self.repository.get_post_comments(post_id)
        comments = [comment for comment in comments if comment.parent is None]

        return await self.dump_items(comments, CommentModel)

    async def delete_post_comment(self, comment_id: int) -> None:
        comment = await self.repository.get_item(comment_id)

        await self.check_item(comment, CommentNotFound)

        return await self.repository.delete_item(comment)

    async def update_post_comment(
        self,
        comment_id: int,
        text: str,
        new_images: list[UploadFile] | None,
        deleted_images: list[UploadFile] | None,
    ) -> CommentModel:
        comment = await self.repository.get_item(comment_id)

        await self.check_item(comment, CommentNotFound)

        if new_images:
            new_images = await self.s3_client.upload_many_files(
                new_images,
                f"posts/{comment.post_fk}/comments/{comment.author.id}/{uuid4()}",
            )

        if deleted_images:
            await self.s3_client.delete_many_files(deleted_images)

        comment = await self.repository.update_item(
            comment_id,
            text=text,
            images=new_images,
            deleted_images=deleted_images,
        )

        return await self.model_dump(comment, CommentModel)
