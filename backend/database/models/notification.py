
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.models.base import Base
from backend.database.models.user import User


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
