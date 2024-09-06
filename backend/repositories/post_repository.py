from pydantic import UUID4
from sqlalchemy import select

from backend.database.models import Post, User
from backend.repositories.base import SqlAlchemyRepository


class PostRepository(SqlAlchemyRepository):
    model = Post

    async def add_item(self, **kwargs) -> Post:
        author = kwargs.pop('author')
        post = self.model(**kwargs)
        author.posts.append(post)

        await self.session.commit()
        await self.session.refresh(post)

        return post

    async def like_post(self, post: Post, user: User) -> None:
        await self.session.refresh(post)
        
        if user in post.likes:
            post.likes.remove(user)
        else:
            post.likes.append(user)
        
        await self.session.commit()
        await self.session.refresh(post)

        return post
    
