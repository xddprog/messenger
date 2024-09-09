from pydantic import UUID4

from backend.database.models import Chat
from backend.dto.chat_dto import BaseChatModel, CreateChatForm
from backend.services import BaseService
from backend.repositories import ChatRepository


class ChatService(BaseService):
    repository: ChatRepository

    async def get_chat(self, chat_id: UUID4) -> Chat:
        return await self.repository.get_item(chat_id)

    async def create_chat(self, form: CreateChatForm) -> BaseChatModel:
        new_chat = await self.repository.add_item(**form.model_dump())
        return await self.model_dump(new_chat, BaseChatModel)
