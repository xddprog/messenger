from datetime import datetime
from pydantic import UUID4
from sqlalchemy import ARRAY, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.models.base import Base
from backend.database.models.user import User


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())
    images: Mapped[list[str]] = mapped_column(ARRAY(String), default=[])
    is_edited: Mapped[bool] = mapped_column(default=False)

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
    users_who_readed: Mapped[list["User"]] = relationship(
        back_populates="readed_messages",
        secondary="users_readed_messages",
        uselist=True,
        lazy="selectin",
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
