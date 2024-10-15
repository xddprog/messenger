from uuid import uuid4
from fastapi import UploadFile
from pydantic import UUID4

from backend.database.models import Chat, User
from backend.dto.chat_dto import BaseChatModel
from backend.dto.message_dto import MessageModel
from backend.services import BaseService
from backend.repositories import ChatRepository


class ChatService(BaseService):
    repository: ChatRepository

    @staticmethod
    async def create_image_url(author_id: UUID4, image_id: UUID4) -> str:
        return f"chats/{image_id}"

    async def get_chat(
        self, chat_id: UUID4, dump: bool = False
    ) -> Chat | None:
        chat = await self.repository.get_item(chat_id)

        return chat if not dump else await self.model_dump(chat, BaseChatModel)

    async def create_chat(
        self,
        chat_id: UUID4,
        title: str,
        users: list[User],
        avatar: UploadFile,
        creator: User,
    ) -> BaseChatModel:
        avatar = await self.s3_client.upload_one_file(
            file=avatar, path=await self.create_image_url(chat_id, uuid4())
        )
        new_chat = await self.repository.add_item(
            id=chat_id, users=users, title=title, avatar=avatar, creator=creator
        )
        return await self.model_dump(new_chat, BaseChatModel)

    async def get_messages_from_chat(
        self, chat_id: UUID4, offset: int
    ) -> list[MessageModel]:
        # messages = await self.repository.get_messages_from_chat(
        #     chat_id, offset
        # )
        chat = await self.repository.get_item(chat_id)
        return await self.dump_items(chat.messages[offset * 20 : offset * 20 + 20], MessageModel)