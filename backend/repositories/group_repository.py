from pydantic import UUID4
from sqlalchemy import select, update
from backend.database.models import Group, User
from backend.database.models.post import Post
from backend.database.models.user import UserAdminedGroups, UserGroups
from backend.repositories.base import SqlAlchemyRepository


class GroupRepository(SqlAlchemyRepository):
    model = Group

    async def get_user_groups(self, user_id: str) -> Group | None:
        query = select(self.model).where(
            self.model.users.any(User.id == user_id)
        )
        groups = await self.session.execute(query)
        return groups.scalars().all()

    async def get_user_admined_groups(self, user_id: str) -> Group | None:
        query = select(self.model).where(
            self.model.admins.any(User.id == user_id)
        )
        groups = await self.session.execute(query)
        return groups.scalars().all()

    async def add_item(
        self,
        group_id: str,
        title: str,
        description: str,
        avatar: str | None,
        cover: str | None,
        creator: str,
    ) -> Group:

        group = self.model(
            id=group_id,
            title=title,
            description=description,
            avatar=avatar,
            cover=cover,
            creator_fk=creator
        )

        self.session.add(group)
        self.session.add(UserAdminedGroups(user_fk=creator, group_fk=group_id))
        self.session.add(UserGroups(user_fk=creator, group_fk=group_id))
        
        await self.session.commit()
        await self.session.refresh(group)
        return group

    async def join_user_to_group(self, group_id: str, user_id: str) -> Group:
        is_sub = None
        user_in_group_query = select(UserGroups).where(
            UserGroups.user_fk == user_id, 
            UserGroups.group_fk == group_id
        )
        user_in_group = (
            await self.session.execute(user_in_group_query)
        ).scalar_one_or_none()

        if user_in_group:
            await self.session.delete(user_in_group)
            is_sub = False
        else:
            self.session.add(
                UserGroups(
                    user_fk=user_id, 
                    group_fk=group_id
                )
            )
            is_sub = True
        await self.session.commit()
        return is_sub

    async def get_subscribers(self, group_id: UUID4) -> list[User]:
        query = select(User).where(User.groups.any(Group.id == group_id))
        users = await self.session.execute(query)
        return users.scalars().all()
    
    async def check_user_is_subscriber(self, user_id: UUID4, group_id: UUID4) -> bool:
        query = (
            select(User)
            .join(UserGroups, User.id == UserGroups.user_fk)
            .join(Group, Group.id == UserGroups.group_fk) 
            .where(
                UserGroups.user_fk == user_id, 
                UserGroups.group_fk == group_id
            )
        )
        user = await self.session.execute(query)
        return user.scalar_one_or_none()
    
    async def check_user_is_admin(self, user_id: UUID4, group_id: UUID4) -> bool:
        query = (
            select(User)
            .join(UserAdminedGroups, User.id == UserAdminedGroups.user_fk)
            .join(Group, Group.id == UserAdminedGroups.group_fk)          
            .where(
                UserAdminedGroups.user_fk == user_id, 
                UserAdminedGroups.group_fk == group_id
            )
        )
        user = await self.session.execute(query)
        return user.scalar_one_or_none()
    
    async def update_item(self, item_id: UUID4, **update_values) -> Group:
        query = (
            update(self.model)
            .where(self.model.id == item_id)
            .values(update_values)
            .returning(self.model)
        )

        group = await self.session.execute(query)
        group: Group = group.scalars().all()[0]

        if update_values.get("avatar"):
            group.images = [*group.images, update_values.get("avatar")]

        await self.session.commit()
        await self.session.refresh(group)
        return group
    
    async def get_group_posts(self, group_id: UUID4):
        query = select(Post).where(Post.group_fk == group_id)
        posts = await self.session.execute(query)
        return posts.scalars().all()