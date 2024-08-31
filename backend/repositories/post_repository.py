from pydantic import UUID4

from database.models import Post, User
from repositories.base import SqlAlchemyRepository


class PostRepository(SqlAlchemyRepository):
    model = Post

    async def add_item(self, **kwargs) -> Post:
        author = kwargs.pop('author')
        post = self.model(**kwargs)
        author.posts.append(post)

        await self.session.commit()
        await self.session.refresh(post)

        return post

    async def like_post(self, post_id: UUID4, user: User) -> None:
        post = await self.session.get(Post, post_id)
        await self.session.refresh(post)

        if user in post.likes:
            post.likes.remove(user)
        else:
            post.likes.append(user)
        
        await self.session.commit()
        await self.session.refresh(post)

        return post
    