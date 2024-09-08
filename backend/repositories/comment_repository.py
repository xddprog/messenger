from backend.database.models import Comment
from backend.repositories.base import SqlAlchemyRepository


class CommentRepository(SqlAlchemyRepository):
    model = Comment

    async def add_item(self, **kwargs):
        return Comment(**kwargs)