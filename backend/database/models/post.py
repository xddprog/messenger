from datetime import datetime
from pydantic import UUID4
from sqlalchemy import ARRAY, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.models.base import Base


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    text: Mapped[str]
    images: Mapped[str] = mapped_column(ARRAY(String), default=[])
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())

    replies: Mapped[list["Comment"]] = relationship(
        back_populates="parent", lazy="selectin", cascade="all, delete-orphan"
    )
    parent: Mapped["Comment"] = relationship(
        back_populates="replies", remote_side=[id], lazy="selectin"
    )
    author = relationship(
        "User", back_populates="comments", uselist=False, lazy="selectin"
    )
    post: Mapped["Post"] = relationship(
        "Post", back_populates="comments", uselist=False, lazy="selectin"
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

    author = relationship(
        "User", back_populates="posts", uselist=False, lazy="selectin"
    )
    group = relationship(
        "Group", back_populates="posts", uselist=False, lazy="selectin"
    )
    likes = relationship(
        "User",
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
