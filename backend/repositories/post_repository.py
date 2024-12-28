from pydantic import UUID4
from sqlalchemy import select
from backend.database.models import Comment, Post, User
from backend.database.models.user import UserLikedPosts
from backend.repositories.base import SqlAlchemyRepository


class PostRepository(SqlAlchemyRepository):
    model = Post

    async def add_item(self, **kwargs) -> Post:
        post = self.model(**kwargs)
        self.session.add(post)
        await self.session.commit()
        await self.session.refresh(post)
        return post

    async def like_post(self, post_id: UUID4, user_id: str) -> Post:
        is_liked_query = select(UserLikedPosts).where(
            post_fk=post_id, user_fk=user_id
        )
        liked_post = (await self.session.execute(is_liked_query)).scalar_one_or_none()
        if liked_post:
            await self.session.delete(liked_post)
        else:
            self.session.add(
                UserLikedPosts(
                    user_fk=user_id,
                    post_fk=post_id
                )
            )

        await self.session.commit()
        
    async def delete_item(self, item: Post) -> None:
        for comment in item.comments:
            await self.session.delete(comment)

        await self.session.delete(item)
        await self.session.commit()

    async def get_user_posts(self, user_id: UUID4) -> list[Post]:
        query = select(self.model).where(
            self.model.author_fk == user_id, 
            self.model.group_fk == None
        )

        posts = await self.session.execute(query)
        posts = posts.scalars().all()

        return posts
