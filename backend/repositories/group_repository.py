from pydantic import UUID4
from requests import session
from sqlalchemy import select
from sqlalchemy.orm import query
from backend.database.models import Group, User
from backend.repositories.base import SqlAlchemyRepository


class GroupRepository(SqlAlchemyRepository):
    model = Group

    async def get_user_groups(self, user_id: str) -> Group | None:
        query = select(self.model).where(self.model.users.any(User.id == user_id))   

        groups  = await self.session.execute(query)

        return groups.scalars().all()
    
    async def get_user_admined_groups(self, user_id: str) -> Group | None:
        query = select(self.model).where(self.model.admins.any(User.id == user_id))

        groups  = await self.session.execute(query)
        
        return groups.scalars().all()

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
