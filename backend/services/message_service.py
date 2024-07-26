from pydantic import UUID4

from database.models import Message, User, Chat
from dto.message_dto import MessageModel
from repositories import MessageRepository
from services import BaseService


class MessageService(BaseService):
    repository: MessageRepository

    async def get_model(self, message: Message):
        new_message = await self.repository.get_model(message=message)
        return await self.model_dump(new_message, MessageModel)

    async def create_message(self, message: str, user: User, chat: Chat) -> MessageModel:
        new_message = await self.repository.add_item(
            message=message,
            user=user,
            chat=chat
        )
        return await self.model_dump(new_message, MessageModel)

    async def get_messages_from_chat(self, chat_id: UUID4, offset: int):
        messages = await self.repository.get_messages_from_chat(chat_id, offset)
        return await self.dump_items(messages, MessageModel)
