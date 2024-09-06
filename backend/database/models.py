from datetime import datetime
from uuid import UUID

from pydantic import UUID4

from sqlalchemy import DateTime, ForeignKey, ARRAY, String
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID

from backend.utils.config.constants import BASE_AVATAR_URL


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = 'users'
    
    id: Mapped[str] = mapped_column(primary_key=True, unique=True)
    username: Mapped[str]
    password: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    avatar: Mapped[str] = mapped_column(nullable=True, default=BASE_AVATAR_URL)
    city: Mapped[str] 
    images = mapped_column(ARRAY(String), default=[])
    birthday: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    description: Mapped[str]
    friends = mapped_column(ARRAY(String), default=[])

    posts: Mapped[list['Post']] = relationship(
        back_populates="author",
        lazy='selectin'
    )
    chats: Mapped[list['Chat']] = relationship(
        back_populates="users",
        secondary='user_chats',
        uselist=True,
        lazy='selectin'
    )
    messages: Mapped[list['Message']] = relationship(
        back_populates='user',
        uselist=True,
        lazy='selectin'
    )
    liked_posts: Mapped[list['Post']] = relationship(
        back_populates="likes",
        secondary='users_liked_posts',
        uselist=True,
        lazy='selectin'
    )


class Post(Base):
    __tablename__ = 'posts'

    id: Mapped[UUID4] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(nullable=True)
    images = mapped_column(ARRAY(String), nullable=True)
    views: Mapped[int] = mapped_column(default=1)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())

    author: Mapped['User'] = relationship(
        back_populates="posts",
        uselist=True,
        lazy='selectin'
    )
    likes: Mapped[list['User']] = relationship(
        back_populates="liked_posts",
        secondary='users_liked_posts',
        uselist=True,
        lazy='selectin'
    )

    author_fk: Mapped[UUID4 | None] = mapped_column(ForeignKey('users.id'), default=None)


class Message(Base):
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())

    user_fk: Mapped[UUID4 | None] = mapped_column(ForeignKey('users.id'), default=None)
    chat_fk: Mapped[UUID4 | None] = mapped_column(ForeignKey('chats.id'), default=None)

    user: Mapped['User'] = relationship(
        back_populates="messages",
        uselist=False,
        lazy='selectin'
    )
    chat: Mapped['Chat'] = relationship(
        back_populates="messages",
        uselist=False
    )


class Chat(Base):
    __tablename__ = 'chats'

    id: Mapped[UUID4] = mapped_column(primary_key=True)
    title: Mapped[str]
    avatar: Mapped[str]

    users: Mapped[list['User']] = relationship(
        back_populates="chats",
        secondary="user_chats",
        uselist=True,
        lazy='selectin'
    )
    messages: Mapped[list['Message']] = relationship(
        back_populates='chat',
        uselist=True,
        lazy='selectin'
    )


class UserChat(Base):
    __tablename__ = 'user_chats'
    user_fk: Mapped[UUID4] = mapped_column(ForeignKey('users.id'), primary_key=True)
    chat_fk: Mapped[UUID4] = mapped_column(ForeignKey('chats.id'), primary_key=True)


class UserLikedPosts(Base):
    __tablename__ = 'users_liked_posts'
    user_fk: Mapped[UUID4] = mapped_column(ForeignKey('users.id'), primary_key=True, nullable=True)
    post_fk: Mapped[UUID4] = mapped_column(ForeignKey('posts.id'), primary_key=True, nullable=True)
