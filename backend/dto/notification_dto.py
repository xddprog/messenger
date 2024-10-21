from pydantic import BaseModel


class BaseNotificationModel(BaseModel):
    id: int | None = None
    message: str
    is_read: bool
    notification_sender_name: str
    notification_type: str
    notification_sender_id: str
    image: str
