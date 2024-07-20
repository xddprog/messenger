from datetime import datetime
from typing import Optional

from pydantic import UUID4

from sqlalchemy import ForeignKey, ARRAY, String
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = 'users'
    
    id: Mapped[UUID4] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    avatar: Mapped[str] = mapped_column(nullable=True)

    posts: Mapped[list['Post']] = relationship(back_populates="author", lazy='selectin')


class Post(Base):
    __tablename__ = 'posts'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    description: Mapped[str] = mapped_column(nullable=True)
    images = mapped_column(ARRAY(String), default=[])
    likes: Mapped[int] = mapped_column(default=0)
    dislikes: Mapped[int] = mapped_column(default=0)
    views: Mapped[int] = mapped_column(default=1)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())

    author: Mapped['User'] = relationship(back_populates="posts", uselist=True, lazy='selectin')
    author_fk: Mapped[UUID4 | None] = mapped_column(ForeignKey('users.id'), default=None)

    # comments: Mapped[list['']] = relationship(back_populates="posts")
