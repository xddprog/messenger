from backend.database.models import Chat
from backend.repositories.base import SqlAlchemyRepository


class ChatRepository(SqlAlchemyRepository):
    model = Chat
