from pydantic import UUID4
from sqlalchemy import ARRAY, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database.models.base import Base
from backend.database.models.post import Post
from backend.database.models.user import User
from backend.utils.config.constants import BASE_GROUP_AVATAR_URL, BASE_GROUP_COVER_URL


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str]

    groups: Mapped[list["Group"]] = relationship(
        back_populates="tags",
        secondary="group_tags",
        uselist=True,
        lazy="selectin",
    )


class Group(Base):
    __tablename__ = "groups"

    id: Mapped[str] = mapped_column(primary_key=True)
    title: Mapped[str]
    description: Mapped[str]

    tags: Mapped[list["Tag"]] = relationship(
        back_populates="groups",
        secondary="group_tags",
        uselist=True,
        lazy="selectin",
    )
    avatar: Mapped[str] = mapped_column(
        nullable=True, default=BASE_GROUP_AVATAR_URL
    )
    cover: Mapped[str] = mapped_column(
        nullable=True, default=BASE_GROUP_COVER_URL
    )
    images = mapped_column(ARRAY(String), default=[])

    creator: Mapped["User"] = relationship(
        back_populates="created_groups", uselist=False, lazy="selectin"
    )
    admins: Mapped[list["User"]] = relationship(
        back_populates="user_admined_groups",
        uselist=True,
        lazy="selectin",
        secondary="users_admined_groups",
    )
    posts: Mapped[list["Post"]] = relationship(
        back_populates="group", uselist=True, lazy="selectin"
    )
    users: Mapped[list["User"]] = relationship(
        back_populates="groups",
        uselist=True,
        lazy="selectin",
        secondary="users_groups",
    )

    creator_fk: Mapped[UUID4] = mapped_column(ForeignKey("users.id"))


class GroupTag(Base):
    __tablename__ = "group_tags"
    tag_fk: Mapped[int] = mapped_column(ForeignKey("tags.id"), primary_key=True)
    group_fk: Mapped[str] = mapped_column(
        ForeignKey("groups.id"), primary_key=True
    )
