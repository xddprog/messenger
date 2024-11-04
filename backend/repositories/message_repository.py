from datetime import datetime
from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.database.models import Message, User, Chat
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

    async def add_item(
        self, message: str, user_id: str, chat_id: str, images: list[str]
    ) -> Message:
        message = Message(
            message=message,
            user_fk=user_id,
            chat_fk=chat_id,
            created_at=datetime.now(),
            images=images,
        )

        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return message

    async def update_item(
        self, message_id: int, message: str | None
    ) -> Message:
        getted_message = await self.session.get(Message, message_id)

        getted_message.is_edited = True
        getted_message.message = message

        await self.session.commit()
        await self.session.refresh(getted_message)

        return getted_message

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

    async def read_message(self, message: Message, user_id: UUID4) -> None:
        message.users_who_readed.append(await self.session.get(User, user_id))
        await self.session.commit()
