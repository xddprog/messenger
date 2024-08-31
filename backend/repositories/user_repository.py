from pydantic import UUID4
from sqlalchemy import select

from database.models import Post, User
from repositories.base import SqlAlchemyRepository


class UserRepository(SqlAlchemyRepository):
    model = User

    async def add_friend(self, user_id: UUID4, friend_id: UUID4):
        user = await self.session.get(self.model, user_id)

        user.friends = [*user.friends, friend_id]

        await self.session.commit()

    async def remove_friend(self, user_id: UUID4, friend_id: UUID4):
        user = await self.session.get(self.model, user_id)

        user.friends = [friend for friend in user.friends if friend != str(friend_id)]
        select()
        await self.session.commit()

    async def search_users(self, username: str, **kwargs: str):
        query = select(
            self.model
        ).where(
            self.model.username.contains(username)
        ).filter_by(
            **kwargs
        )

        users = await self.session.execute(query)
        users = users.scalars().all()

        return users
