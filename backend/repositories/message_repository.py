from pydantic import UUID4
from sqlalchemy import select

from database.models import Message, User, Chat
from repositories.base import SqlAlchemyRepository


class MessageRepository(SqlAlchemyRepository):
    model = Message

    async def add_item(self, message: str, user: User, chat: Chat) -> Message:
        message = Message(message=message, user=user, chat=chat)

        user.messages.append(message)
        chat.messages.append(message)

        await self.session.commit()
        await self.session.refresh(user)
        await self.session.refresh(chat)
        await self.session.refresh(message)

        return message

    async def get_messages_from_chat(self, chat_id: UUID4, offset: int) -> list[Message]:
        query = select(Message).join(Chat).where(Chat.id == chat_id).limit(20).offset(offset * 20)
        messages = await self.session.execute(query)
        return messages.scalars().all()
