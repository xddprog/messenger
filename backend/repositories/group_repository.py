from pydantic import UUID4
from requests import session
from backend.database.models import Group, User
from backend.repositories.base import SqlAlchemyRepository


class GroupRepository(SqlAlchemyRepository):
    model = Group

    async def add_item(self, **kwargs: int | str | UUID4) -> type[Group]:
        creator: User = kwargs.pop("creator")

        group = self.model(**kwargs)
        group.users.append(creator)
        group.admins.append(creator)
        group.creator = creator

        self.session.add(group)

        await self.session.commit()
        await self.session.refresh(group)

        return group

    async def join_user_to_group(self, group: Group, user: User) -> Group:
        await self.session.refresh(group)

        if user in group.users:
            group.users.remove(user)
        else:
            group.users.append(user)

        await self.session.commit()
