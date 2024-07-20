from database.models import Post, User
from repositories.base import SqlAlchemyRepository


class PostRepository(SqlAlchemyRepository):
    model = Post

    async def add_item(self, author: User, form: dict) -> Post:
        post = self.model(**form)
        author.posts.append(post)
        await self.session.commit()

        await self.session.refresh(post)
        return post