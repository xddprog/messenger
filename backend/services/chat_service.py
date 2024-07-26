from pydantic import UUID4

from database.models import Chat
from dto.chat_dto import BaseChatModel, CreateChatForm
from dto.message_dto import MessageModel
from services import BaseService


class ChatService(BaseService):
    async def get_chat(self, chat_id: UUID4) -> Chat:
        return await self.repository.get_item(chat_id)

    async def create_chat(self, form: CreateChatForm) -> BaseChatModel:
        new_chat = await self.repository.add_item(**form.model_dump())
        return await self.model_dump(new_chat, BaseChatModel)
