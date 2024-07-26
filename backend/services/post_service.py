from uuid import uuid4

from pydantic import UUID4

from database.models import User
from dto.post_dto import PostModel
from repositories import PostRepository
from services import BaseService


class PostService(BaseService):
    repository: PostRepository

    async def create_post(self, description: str, images: list, author: User) -> PostModel:
        post_id = uuid4()
        if images:
            images = await self.s3_client.upload_many_files(
                images,
                f'posts/{author.id}/{post_id}'
            )

        post = await self.repository.add_item(
            id=post_id,
            description=description,
            images=images,
            author=author
        )
        return await self.model_dump(post, PostModel)

    async def get_all_posts(self) -> list[PostModel]:
        posts = await self.repository.get_all_items()
        return await self.dump_items(posts, PostModel)

    async def like_post(self, post_id, user: User):
        post = await self.repository.like_post(post_id, user)
        return await self.model_dump(post, PostModel)
