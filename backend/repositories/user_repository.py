from sqlalchemy import select, update

from backend.database.models import User
from backend.repositories.base import SqlAlchemyRepository


class UserRepository(SqlAlchemyRepository):
    model = User

    async def add_friend(self, user_id: str, friend_id: str) -> None:
        user = await self.session.get(self.model, user_id)
        friend = await self.session.get(self.model, friend_id)

        user.friends = [*user.friends, friend_id]
        friend.friends = [*friend.friends, user_id]

        await self.session.commit()

    async def remove_friend(self, user_id: str, friend_id: str) -> None:
        user = await self.session.get(self.model, user_id)
        friend = await self.session.get(self.model, friend_id)

        user.friends = [
            friend for friend in user.friends if friend != str(friend_id)
        ]
        friend.friends = [
            user for user in friend.friends if user != str(user_id)
        ]

        await self.session.commit()

    async def search_users(
        self, username: str, current_user_id: str, **kwargs: str
    ) -> list[User]:
        query = (
            select(self.model)
            .where(
                self.model.username.contains(username),
                self.model.id != current_user_id,
            )
            .filter_by(**kwargs)
        )

        users = await self.session.execute(query)
        users = users.scalars().all()

        return users

    async def update_item(self, item_id: int | str, **update_values) -> User:
        query = (
            update(self.model)
            .where(self.model.id == item_id)
            .values(update_values)
            .returning(self.model)
        )

        user = await self.session.execute(query)
        user: User = user.scalars().all()[0]

        if update_values.get("avatar"):
            user.images = [*user.images, update_values.get("avatar")]

        await self.session.commit()

        return user
