from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from backend.database.models import Comment
from backend.repositories.base import SqlAlchemyRepository


class CommentRepository(SqlAlchemyRepository):
    model = Comment

    async def add_item(self, **kwargs):
        return Comment(**kwargs)

    async def get_post_comments(self, post_id: UUID4) -> list[Comment]:
        query = (
            select(self.model)
            .where(self.model.post_fk == post_id)
            .options(selectinload(self.model.replies))
        )

        comments = await self.session.execute(query)
        comments = comments.scalars().all()

        return comments
    
    async def update_item(
        self, 
        comment_id: int,
        text: str, 
        images: list[str] | None,
        deleted_images: list[str] | None
    ):
        comment = await self.session.get(self.model, comment_id)

        if text:
            comment.message = text

        if deleted_images:
            comment.images = [
                image
                for image in comment.images
                if image not in deleted_images
            ]

        if images:
            comment.images = [*comment.images, images]

        await self.session.commit()
        await self.session.refresh(comment)

        return comment