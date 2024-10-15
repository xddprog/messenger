from sqlalchemy import select
from backend.database.models import Notification, User
from backend.repositories.base import SqlAlchemyRepository
from backend.utils.config.enums import NotificationType


class NotificationRepository(SqlAlchemyRepository):
    model = Notification

    async def get_item(
        self,
        notification_sender_id: str,
        notification_user_id: str,
        notification_type: str,
    ) -> Notification | None:
        query = select(self.model).where(
            self.model.notification_type == notification_type,
            self.model.notification_sender_id == notification_sender_id,
            self.model.users.any(User.id == notification_user_id),
        )

        notification = await self.session.execute(query)
        notification = notification.scalars().all()[0]

        return notification

    async def add_item(self, **kwargs) -> Notification:
        user: User = kwargs.pop("user")

        notification = self.model(**kwargs)

        user.notifications.append(notification)
        self.session.add(notification)
        await self.session.commit()
        await self.session.refresh(notification)

        return notification

    async def check_request_add_friend_is_send(
        self, current_user_id: str, user_id: str
    ) -> bool:
        query = select(self.model).where(
            self.model.notification_type == NotificationType.ADD_FRIEND.value,
            self.model.notification_sender_id == user_id,
            self.model.users.any(User.id == current_user_id),
        )

        notifications = await self.session.execute(query)
        notifications = notifications.scalars().all()

        return notifications

    async def check_request_add_friend_is_get(
        self, current_user_id: str, user_id: str
    ) -> bool:
        query = select(self.model).where(
            self.model.notification_type == NotificationType.ADD_FRIEND.value,
            self.model.notification_sender_id == current_user_id,
            self.model.users.any(User.id == user_id),
        )

        notifications = await self.session.execute(query)
        notifications = notifications.scalars().all()

        return notifications
