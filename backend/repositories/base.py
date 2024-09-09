from abc import ABC, abstractmethod

from pydantic import UUID4
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.models import Post


class BaseRepository(ABC):
    @abstractmethod
    async def get_item(self, item_id: int | UUID4 | str):
        raise NotImplementedError

    @abstractmethod
    async def get_all_items(self):
        raise NotImplementedError

    @abstractmethod
    async def get_by_attribute(self, attribute, value: str | UUID4 | int):
        raise NotImplementedError

    @abstractmethod
    async def add_item(self, **kwargs):
        raise NotImplementedError

    @abstractmethod
    async def delete_item(self, item_id: int | str):
        raise NotImplementedError

    @abstractmethod
    async def update_item(self, item_id: int | str, **update_values):
        raise NotImplementedError

    @abstractmethod
    def get_model(self, **kwargs):
        raise NotImplementedError


class SqlAlchemyRepository(BaseRepository):
    model = None

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_item(self, item_id: int | UUID4):
        item = await self.session.get(self.model, item_id)

        return item

    async def get_all_items(self):
        query = select(self.model)
        items = await self.session.execute(query)

        return items.scalars().all()

    async def get_by_attribute(self, attribute, value: str | UUID4 | int):
        query = select(self.model).where(attribute == value)
        items = await self.session.execute(query)

        return items.scalars().all()

    async def add_item(self, **kwargs):
        item = self.model(**kwargs)

        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)

        return item

    async def delete_item(self, post: Post):
        await self.session.delete(post)
        await self.session.commit()

    async def update_item(self, item_id: int | str, **update_values):
        query = (
            update(self.model)
            .where(self.model.id == item_id)
            .values(update_values)
            .returning(self.model)
        )

        item = await self.session.execute(query)
        await self.session.commit()

        return item.scalars().all()[0]

    async def get_model(self, **kwargs):
        return self.model(**kwargs)
