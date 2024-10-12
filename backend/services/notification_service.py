from backend.dto.notification_dto import BaseNotificationModel
from backend.repositories import NotificationRepository
from backend.services.base_service import BaseService


class NotificationService(BaseService):
    repository: NotificationRepository

    async def create_notification(self, **kwargs) -> BaseNotificationModel:
        notification = await self.repository.add_item(**kwargs)
        return await self.model_dump(notification, BaseNotificationModel)

    async def notification_is_read(self, notification_id: int):
        return await self.repository.update_item(
            is_read=True, notification_id=notification_id
        )

    async def check_request_add_friend(
        self, current_user_id, user_id: str
    ) -> bool:
        return bool(
            await self.repository.check_request_add_friend_is_send(
                current_user_id, user_id
            )
        )

    async def check_request_add_friend_is_get(
        self, current_user_id, user_id: str
    ) -> bool:
        return bool(
            await self.repository.check_request_add_friend_is_get(
                current_user_id, user_id
            )
        )

    async def get_notification(
        self,
        notification_sender_id: str,
        notification_user_id: str,
        notification_type: str
    ):
        return await self.repository.get_item(
            notification_sender_id, notification_user_id, notification_type
        )   

    async def delete_notification(
        self,
        notification_sender_id: str,
        notification_user_id: str,
        notification_type: str
    ):
        notification = await self.get_notification(
            notification_sender_id, notification_user_id, notification_type
        )
        return await self.repository.delete_item(notification)