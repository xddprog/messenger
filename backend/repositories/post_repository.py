from pydantic import UUID4
from sqlalchemy import select
from backend.database.models import Comment, Post, User
from backend.repositories.base import SqlAlchemyRepository


class PostRepository(SqlAlchemyRepository):
    model = Post

    async def add_item(self, **kwargs) -> Post:
        author = kwargs.pop("author")

        post = self.model(**kwargs)
        author.posts.append(post)

        await self.session.commit()
        await self.session.refresh(post)

        return post

    async def like_post(self, post: Post, user: User) -> Post:
        await self.session.refresh(post)

        if user in post.likes:
            post.likes.remove(user)
        else:
            post.likes.append(user)

        await self.session.commit()
        await self.session.refresh(post)

        return post

    async def add_comment(self, post: Post, comment: Comment) -> Post:
        await self.session.refresh(post)

        post.comments.append(comment)

        await self.session.commit()
        await self.session.refresh(comment)

        return comment

    async def delete_item(self, item: Post) -> None:
        for comment in item.comments:
            await self.session.delete(comment)

        await self.session.delete(item)
        await self.session.commit()

    async def get_user_posts(self, user_id: UUID4) -> list[Post]:
        query = select(self.model).where(self.model.author_fk == user_id)

        posts = await self.session.execute(query)
        posts = posts.scalars().all()

        return posts