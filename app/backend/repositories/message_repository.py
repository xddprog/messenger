from pydantic import UUID4
from sqlalchemy import select

from backend.database.models import Message, User, Chat
from backend.repositories.base import SqlAlchemyRepository


class MessageRepository(SqlAlchemyRepository):
    model = Message

    async def add_item(self, message: str, user: User, chat: Chat) -> Message:
        message = Message(message=message, user=user, chat=chat)

        user.messages.append(message)
        chat.messages.append(message)

        await self.session.commit()

        return message

    async def update_item(
        self,
        message_id: int,
        message: str | None,
        new_images: list[str] | None,
        deleted_images: list[str] | None,
    ) -> Message:
        getted_message = await self.session.get(message_id)

        if message:
            getted_message.message = message

        if deleted_images:
            message.images = [
                image
                for image in message.images
                if image not in deleted_images
            ]

        if new_images:
            message.images = [*message.images, new_images]

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
            .limit(20)
            .offset(offset * 20)
        )
        messages = await self.session.execute(query)
        return messages.scalars().all()
