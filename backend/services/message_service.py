from uuid import uuid4
from fastapi import UploadFile
from pydantic import UUID4

from backend.database.models import Message, User, Chat
from backend.dto.message_dto import MessageModel
from backend.errors.message_errors import MessageNotFound
from backend.repositories import MessageRepository
from backend.services import BaseService


class MessageService(BaseService):
    repository: MessageRepository

    async def get_model(self, message: Message):
        new_message = await self.repository.get_model(message=message)
        return await self.model_dump(new_message, MessageModel)

    async def create_message(
        self, message: str, images: list[UploadFile], user: User, chat: Chat
    ) -> MessageModel:
        if images:
            images = await self.s3_client.upload_many_files(
                file=images, path=f"{chat.id}/messages/{user.id}/{uuid4()}"
            )

        new_message = await self.repository.add_item(
            message=message, images=images, user=user, chat=chat
        )
        return await self.model_dump(new_message, MessageModel)

    async def get_messages_from_chat(
        self, chat_id: UUID4, offset: int
    ) -> list[MessageModel]:
        messages = await self.repository.get_messages_from_chat(
            chat_id, offset
        )
        return await self.dump_items(messages, MessageModel)

    async def delete_message(self, message_id: int) -> None:
        message = await self.repository.get_item(message_id)

        await self.check_item(message, MessageNotFound)

        await self.repository.delete_item(message_id)

    async def edit_message(
        self,
        chat_id: UUID4,
        user_id: UUID4,
        message_id: int,
        message: str | None,
        new_images: list[UploadFile] | None,
        deleted_images: list[str] | None,
    ) -> MessageModel:
        message = await self.repository.get_item(message_id)

        await self.check_item(message, MessageNotFound)

        if new_images:
            new_images = await self.s3_client.upload_many_files(
                files=new_images,
                path=f"{chat_id}/messages/{user_id}/{uuid4()}",
            )

        if deleted_images:
            await self.s3_client.delete_files(deleted_images)

        message = await self.repository.update_item(
            message_id,
            message=message,
            images=new_images,
            deleted_images=deleted_images,
        )

        return await self.model_dump(message, MessageModel)
