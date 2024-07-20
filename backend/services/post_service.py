from dto.post_dto import CreatePostModel, PostModel
from services import BaseService


class PostService(BaseService):
    async def create_post(self, form: CreatePostModel) -> PostModel:
        post = await self.repository.add_item(form.author, form.model_dump())
        return post
    
    async def get_all_posts(self) -> list[PostModel]:
        posts = await self.repository.get_all_items()
        return await self.dump_items(posts, PostModel)