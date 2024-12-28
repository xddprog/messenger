from pydantic import UUID4
from backend.database.models import Chat
from backend.database.models.user import UserChat
from backend.repositories.base import SqlAlchemyRepository


class ChatRepository(SqlAlchemyRepository):
    model = Chat

    async def add_item(
        self,
        chat_id: UUID4,
        title: str,
        users: list[str],
        avatar: str,
        creator_fk: str,
    ) -> Chat:
        chat = self.model(
            id=chat_id,
            title=title,
            avatar=avatar,
            creator_fk=creator_fk,
        )
        users = [UserChat(user_fk=user_id, chat_fk=chat_id) for user_id in users]

        self.session.add(chat)
        self.session.add_all(users)

        await self.session.commit()
        await self.session.refresh(chat)
        return chat
