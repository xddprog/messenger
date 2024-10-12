from enum import Enum


class NotificationType(Enum):
    ADD_FRIEND = "add_friend"
    ADD_FRIEND_ACCEPT = "add_friend_accept"
    REMOVE_FRIEND = "remove_friend"
    LIKE_POST = "like_post"
    COMMENT_POST = "comment_post"
    NEW_POST = "new_post"
