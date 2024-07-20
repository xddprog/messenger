from database.models import Post, User
from repositories.base import SqlAlchemyRepository


class UserRepository(SqlAlchemyRepository):
    model = User