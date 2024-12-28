from datetime import datetime
from os import read
from pydantic import UUID4
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

from backend.database.models import Message, User, Chat
from backend.database.models.user import UsersReadedMessages
from backend.repositories.base import SqlAlchemyRepository


class MessageRepository(SqlAlchemyRepository):
    model = Message

    async def get_item(self, message_id: int) -> Message | None:
        query = (
            select(Message)
            .where(Message.id == message_id)
            .options(selectinload(Message.users_who_readed))
        )

        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_messages_from_chat(
        self, chat_id: UUID4, offset: int
    ) -> list[Message]:
        query = (
            select(Message)
            .join(Chat)
            .where(Chat.id == chat_id)
            .order_by(Message.created_at.desc())
            .limit(20)
            .offset(offset * 20)
        )
        messages = await self.session.execute(query)
        return messages.scalars().all()

    async def read_message(self, message_id: int, user_id: str) -> None:
        UsersReadedMessages(user_fk=user_id, message_fk=message_id)
        await self.session.commit()

    async def check_user_is_read_message(self, user_id: str, message_id: str) -> bool:
        query = select(UsersReadedMessages).where(
            UsersReadedMessages.user_fk == user_id, 
            UsersReadedMessages.message_fk == message_id
        )
        readed_message = await self.session.execute(query)
        return readed_message.scalar_one_or_none()