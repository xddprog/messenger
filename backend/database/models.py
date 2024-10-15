from datetime import datetime
from typing import Type

from pydantic import UUID4

from sqlalchemy import DateTime, ForeignKey, ARRAY, String
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship

from backend.utils.config.constants import (
    BASE_GROUP_AVATAR_URL,
    BASE_GROUP_COVER_URL,
    BASE_USER_AVATAR_URL,
    BASE_USER_COVER_URL,
)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(primary_key=True, unique=True)
    username: Mapped[str]
    password: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    avatar: Mapped[str] = mapped_column(
        nullable=True, default=BASE_USER_AVATAR_URL
    )
    cover: Mapped[str] = mapped_column(
        nullable=True, default=BASE_USER_COVER_URL
    )
    city: Mapped[str]
    images = mapped_column(ARRAY(String), default=[])
    birthday: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    description: Mapped[str]
    friends = mapped_column(ARRAY(String), default=[])

    posts: Mapped[list["Post"]] = relationship(
        back_populates="author", lazy="selectin"
    )
    chats: Mapped[list["Chat"]] = relationship(
        back_populates="users",
        secondary="user_chats",
        uselist=True,
        lazy="selectin",
    )
    created_chats: Mapped[list["Chat"]] = relationship(
        back_populates="creator", uselist=True, lazy="selectin"
    )
    messages: Mapped[list["Message"]] = relationship(
        back_populates="user", uselist=True, lazy="selectin"
    )
    liked_posts: Mapped[list["Post"]] = relationship(
        back_populates="likes",
        secondary="users_liked_posts",
        uselist=True,
        lazy="selectin",
    )
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="author", uselist=True, lazy="selectin"
    )
    groups: Mapped[list["Group"]] = relationship(
        back_populates="users",
        uselist=True,
        lazy="selectin",
        secondary="users_groups",
    )
    created_groups: Mapped[list["Group"]] = relationship(
        back_populates="creator", uselist=True, lazy="selectin"
    )
    user_admined_groups: Mapped[list["Group"]] = relationship(
        back_populates="admins",
        uselist=True,
        lazy="selectin",
        secondary="users_admined_groups",
    )
    notifications: Mapped[list["Notification"]] = relationship(
        back_populates="users",
        secondary="users_notifications",
        uselist=True,
        lazy="selectin",
    )

    group_fk: Mapped[UUID4 | None] = mapped_column(ForeignKey("groups.id"))


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    text: Mapped[str]
    images: Mapped[str] = mapped_column(ARRAY(String), default=[])
    created_at: Mapped[datetime]

    replies: Mapped[list["Comment"]] = relationship(
        back_populates="parent", lazy="selectin", cascade="all, delete-orphan"
    )
    parent: Mapped["Comment"] = relationship(
        back_populates="replies", remote_side=[id], lazy="selectin"
    )
    author: Mapped["User"] = relationship(
        back_populates="comments", uselist=False, lazy="selectin"
    )
    post: Mapped["Post"] = relationship(
        back_populates="comments", uselist=False, lazy="selectin"
    )

    author_fk: Mapped[str] = mapped_column(ForeignKey("users.id"))
    post_fk: Mapped[UUID4] = mapped_column(ForeignKey("posts.id"))
    parent_id: Mapped[int] = mapped_column(
        ForeignKey("comments.id"), nullable=True
    )


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[UUID4] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(nullable=True)
    images = mapped_column(ARRAY(String), nullable=True)
    views: Mapped[int] = mapped_column(default=1)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())

    author: Mapped["User"] = relationship(
        back_populates="posts", uselist=True, lazy="selectin"
    )
    group: Mapped["Group"] = relationship(
        back_populates="posts", uselist=False, lazy="selectin"
    )
    likes: Mapped[list["User"]] = relationship(
        back_populates="liked_posts",
        secondary="users_liked_posts",
        uselist=True,
        lazy="selectin",
    )
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", uselist=True, lazy="selectin"
    )

    author_fk: Mapped[str | UUID4 | None] = mapped_column(
        ForeignKey("users.id")
    )
    group_fk: Mapped[UUID4 | None] = mapped_column(
        ForeignKey("groups.id"), default=None
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())
    images: Mapped[list[str]] = mapped_column(ARRAY(String), default=[])

    user_fk: Mapped[UUID4 | None] = mapped_column(
        ForeignKey("users.id"), default=None
    )
    chat_fk: Mapped[UUID4 | None] = mapped_column(
        ForeignKey("chats.id"), default=None
    )

    user: Mapped["User"] = relationship(
        back_populates="messages", uselist=False, lazy="selectin"
    )
    chat: Mapped["Chat"] = relationship(
        back_populates="messages", uselist=False
    )


class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[UUID4] = mapped_column(primary_key=True)
    title: Mapped[str]
    avatar: Mapped[str]
    creator: Mapped["User"] = relationship(
        back_populates="created_chats",
        uselist=False,
        lazy="selectin",
    )

    users: Mapped[list["User"]] = relationship(
        back_populates="chats",
        secondary="user_chats",
        uselist=True,
        lazy="selectin",
    )
    messages: Mapped[list["Message"]] = relationship(
        back_populates="chat", uselist=True, lazy="selectin"
    )

    creator_fk: Mapped[str] = mapped_column(ForeignKey("users.id"))


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


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    message: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())
    notification_type: Mapped[str]
    is_read: Mapped[bool] = mapped_column(default=False)
    notification_sender_id: Mapped[str] = mapped_column(nullable=True)
    notification_sender_name: Mapped[str] = mapped_column(nullable=True)
    image: Mapped[str] = mapped_column(nullable=True)

    users: Mapped[list["User"]] = relationship(
        back_populates="notifications",
        secondary="users_notifications",
        uselist=True,
    )


class GroupTag(Base):
    __tablename__ = "group_tags"
    tag_fk: Mapped[int] = mapped_column(
        ForeignKey("tags.id"), primary_key=True
    )
    group_fk: Mapped[str] = mapped_column(
        ForeignKey("groups.id"), primary_key=True
    )


class UserChat(Base):
    __tablename__ = "user_chats"
    user_fk: Mapped[str] = mapped_column(
        ForeignKey("users.id"), primary_key=True
    )
    chat_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("chats.id"), primary_key=True
    )


class UserLikedPosts(Base):
    __tablename__ = "users_liked_posts"
    user_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("users.id"), primary_key=True, nullable=True
    )
    post_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("posts.id"), primary_key=True, nullable=True
    )


class UserGroups(Base):
    __tablename__ = "users_groups"
    user_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("users.id"), primary_key=True
    )
    group_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("groups.id"), primary_key=True
    )


class UserAdminedGroups(Base):
    __tablename__ = "users_admined_groups"
    user_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("users.id"), primary_key=True, nullable=True
    )
    group_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("groups.id"), primary_key=True, nullable=True
    )


class UserNotifications(Base):
    __tablename__ = "users_notifications"
    user_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("users.id"), primary_key=True
    )
    notification_fk: Mapped[int] = mapped_column(
        ForeignKey("notifications.id"), primary_key=True
    )


ModelType = Type[User | Post | Message | Chat | Comment | Group | Notification]
