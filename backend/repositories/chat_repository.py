from database.models import Chat
from repositories.base import SqlAlchemyRepository


class ChatRepository(SqlAlchemyRepository):
    model = Chat
    