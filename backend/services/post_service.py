from fastapi import UploadFile
from pydantic import UUID4

from backend.database.models import Comment, User
from backend.dto.comment_dto import CommentModel
from backend.dto.post_dto import PostModel, UpdatePostModel
from backend.errors.other_errors import AllFieldsAreNoneError
from backend.errors.post_errors import PostNotFound
from backend.repositories import PostRepository
from backend.services import BaseService


class PostService(BaseService):
    repository: PostRepository

    @staticmethod
    async def create_image_url(author_id: UUID4, post_id: UUID4) -> str:
        return f"posts/{author_id}/{post_id}"

    async def create_post(
        self, 
        post_id: UUID4, 
        description: str, 
        images: list, 
        author: str,
        group_id: str | None = None
    ) -> PostModel:
        if images and not isinstance(images[0], str):
            images = await self.s3_client.upload_many_files(
                images, await self.create_image_url(author, post_id)
            )
        else:
            images = []

        post = await self.repository.add_item(
            id=post_id, 
            description=description, 
            images=images, 
            author_fk=author,
            group_fk=group_id
        )
        return await self.model_dump(post, PostModel)
    
    async def update_post(
        self, 
        post_id: UUID4, 
        user_id: str,
        description: str | None,
        new_images: list[UploadFile] | None, 
        old_images: list | None
    ) -> PostModel:
        if not description and not new_images and not old_images:
            raise AllFieldsAreNoneError()
        if new_images:
            new_images = await self.s3_client.upload_many_files(
                new_images, await self.create_image_url(user_id, post_id)
            ) if isinstance(new_images, list) else await self.s3_client.upload_one_file(
                new_images, await self.create_image_url(user_id, post_id)
            )
        
        all_images = []
        if old_images and isinstance(old_images, list):
            all_images.extend(old_images)
        elif old_images:
            all_images.append(old_images)
        if new_images and isinstance(new_images, list):
            all_images.extend(new_images)
        elif new_images:
            all_images.append(new_images)

        post = await self.repository.get_item(post_id)
        await self.check_item(post, PostNotFound)
        post = await self.repository.update_item(
            post_id,
            images=all_images,
            description=description
        )
        return post

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
        await self.repository.like_post(post_id, user)

    async def delete_post(self, post_id: UUID4) -> None:
        post = await self.repository.get_item(post_id)
        await self.check_item(post, PostNotFound)
        return await self.repository.delete_item(post)

    async def check_post_exist(self, post_id: UUID4) -> None:
        post = await self.repository.get_item(post_id)
        await self.check_item(post, PostNotFound)

    async def get_user_posts(self, user_id: UUID4) -> list[PostModel]:
        posts = await self.repository.get_user_posts(user_id)
        return await self.dump_items(posts, PostModel)

    async def read_post(self, post_id: UUID4) -> None:
        post = await self.repository.get_item(post_id)
        await self.check_item(post, PostNotFound)
        post = await self.repository.update_item(post_id, views=post.views + 1)
        return await self.model_dump(post, PostModel)