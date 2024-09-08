from datetime import datetime
from fastapi import UploadFile
from pydantic import UUID4
from backend.database.models import Comment, User
from backend.repositories import CommentRepository
from backend.services.base_service import BaseService


class CommentService(BaseService):
    repository: CommentRepository

    async def add_comment(
        self,
        text: str ,
        created_at: datetime,
        author: User,
        images: list[UploadFile] | list[str],
        parent: int | None
    ) -> Comment:
        if parent:
            parent = await self.repository.get_item(parent)
        return await self.repository.add_item(
            text=text,
            created_at=created_at,
            author=author,
            images=images,
            parent=parent
        )
    