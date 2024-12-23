from datetime import datetime
from pydantic import UUID4
from sqlalchemy import ARRAY, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.models.base import Base
from backend.utils.config.constants import BASE_USER_AVATAR_URL, BASE_USER_COVER_URL


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

    posts = relationship(
        "Post", back_populates="author", lazy="selectin"
    )
    chats = relationship(
        "Chat",
        back_populates="users",
        secondary="user_chats",
        uselist=True,
        lazy="selectin",
    )
    created_chats = relationship(
        "Chat", back_populates="creator", uselist=True, lazy="selectin"
    )
    messages = relationship(
        "Message", back_populates="user", uselist=True, lazy="selectin"
    )
    readed_messages = relationship(
        "Message",
        back_populates="users_who_readed",
        secondary="users_readed_messages",
        uselist=True,
        lazy="selectin",
    )
    liked_posts = relationship(
        "Post",
        back_populates="likes",
        secondary="users_liked_posts",
        uselist=True,
        lazy="selectin",
    )
    comments = relationship(
        "Comment", back_populates="author", uselist=True, lazy="selectin"
    )
    groups = relationship(
        "Group",
        back_populates="users",
        uselist=True,
        lazy="selectin",
        secondary="users_groups",
    )
    created_groups = relationship(
        "Group",
        back_populates="creator", 
        uselist=True, 
        lazy="selectin"
    )
    user_admined_groups = relationship(
        "Group",
        back_populates="admins",
        uselist=True,
        lazy="selectin",
        secondary="users_admined_groups",
    )
    notifications = relationship(
        "Notification",
        back_populates="users",
        secondary="users_notifications",
        uselist=True,
        lazy="selectin",
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


class UsersReadedMessages(Base):
    __tablename__ = "users_readed_messages"
    user_fk: Mapped[UUID4] = mapped_column(
        ForeignKey("users.id"), primary_key=True
    )
    message_fk: Mapped[int] = mapped_column(
        ForeignKey("messages.id"), primary_key=True
    )
