from pydantic import UUID4

from backend.database.models import Comment, User
from backend.dto.comment_dto import CommentModel
from backend.dto.post_dto import PostModel
from backend.errors.post_errors import PostNotFound
from backend.repositories import PostRepository
from backend.services import BaseService


class PostService(BaseService):
    repository: PostRepository

    @staticmethod
    async def create_image_url(author_id: UUID4, post_id: UUID4) -> str:
        return f"posts/{author_id}/{post_id}"

    async def create_post(
        self, post_id: UUID4, description: str, images: list, author: User
    ) -> PostModel:
        if images and not isinstance(images[0], str):
            images = await self.s3_client.upload_many_files(
                images, await self.create_image_url(author.id, post_id)
            )
        else:
            images = []

        post = await self.repository.add_item(
            id=post_id, description=description, images=images, author=author
        )
        return await self.model_dump(post, PostModel)

    async def get_one_post(self, post_id: UUID4) -> PostModel:
        post = await self.repository.get_item(post_id)

        await self.check_item(post, PostNotFound)

        return await self.model_dump(post, PostModel)

    async def get_all_posts(self) -> list[PostModel]:
        posts = await self.repository.get_all_items()
        return await self.dump_items(posts, PostModel)

    async def like_post(self, post_id: UUID4, user: User) -> PostModel:
        post = await self.repository.get_item(post_id)

        await self.check_item(post, PostNotFound)

        await self.repository.like_post(post, user)

        return await self.model_dump(post, PostModel)

    async def delete_post(self, post_id: UUID4) -> None:
        post = await self.repository.get_item(post_id)

        await self.check_item(post, PostNotFound)

        return await self.repository.delete_item(post)

    async def check_post_exist(self, post_id: UUID4) -> None:
        post = await self.repository.get_item(post_id)
        await self.check_item(post, PostNotFound)

    async def add_comment(
        self, post_id: UUID4, comment: Comment
    ) -> CommentModel:
        post = await self.repository.get_item(post_id)

        await self.check_item(post, PostNotFound)
        comment = await self.repository.add_comment(post, comment)

        return await self.model_dump(comment, CommentModel)
