from typing import Type

from backend.database.models.chat import Chat, Message
from backend.database.models.group import Group
from backend.database.models.notification import Notification
from backend.database.models.post import Comment, Post
from backend.database.models.user import User


ModelType = Type[User | Post | Message | Chat | Comment | Group | Notification]
