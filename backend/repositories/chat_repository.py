from backend.database.models import Chat
from backend.repositories.base import SqlAlchemyRepository


class ChatRepository(SqlAlchemyRepository):
    model = Chat

    async def add_item(self, **kwargs) -> Chat:
        creator = kwargs.pop("creator")

        chat = self.model(**kwargs)
        chat.users.append(creator)
        chat.creator = creator

        self.session.add(chat)

        await self.session.commit()
        await self.session.refresh(chat)

        return chat
