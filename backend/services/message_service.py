import base64
from tempfile import SpooledTemporaryFile
from uuid import uuid4
from fastapi import HTTPException, UploadFile
from pydantic import UUID4

from backend.database.models import Message, User, Chat
from backend.dto.message_dto import DeleteMessageModel, MessageModel
from backend.errors.message_errors import MessageNotFound
from backend.repositories import MessageRepository
from backend.services import BaseService


class MessageService(BaseService):
    repository: MessageRepository

    async def convert_message_images(
        self, images: list[dict], path: str
    ) -> list[str]:
        converted_images = []
        for image in images:
            image_data = base64.b64decode(image["file"].split(",")[1])

            with SpooledTemporaryFile() as temp_file:
                temp_file.write(image_data)
                temp_file.seek(0)

                upload_file = UploadFile(
                    file=temp_file,
                    filename=f"{uuid4()}",
                    headers={"content-type": image["content_type"]},
                )

                converted_images.append(
                    await self.s3_client.upload_one_file(
                        file=upload_file, path=f"{path}/{uuid4()}"
                    )
                )

        return converted_images

    async def check_item(
        self, message_id: int, chat_id: UUID4, user_id: str, error: HTTPException
    ) -> None:
        message = await self.repository.get_item(message_id)

        if not message:
            raise error
        elif message.chat_fk != chat_id:
            raise error
        elif message.user_fk != user_id:
            raise error
        
        return message

    async def get_model(self, message: Message):
        new_message = await self.repository.get_model(message=message)
        return await self.model_dump(new_message, MessageModel)

    def fix_base64_string(self, b64_string):
        missing_padding = len(b64_string) % 4
        if missing_padding:
            b64_string += "=" * (4 - missing_padding)

        return b64_string

    async def create_message(
        self, message: str, images: list[dict], user: User, chat: Chat
    ) -> MessageModel:
        if images:
            images = await self.convert_message_images(
                images, f"{chat.id}/messages/{user.id}"
            )

        new_message = await self.repository.add_item(
            message=message, user=user, chat=chat, images=images
        )

        return await self.model_dump(new_message, MessageModel)

    async def get_messages_from_chat(
        self, chat_id: UUID4, offset: int
    ) -> list[MessageModel]:
        messages = reversed(
            await self.repository.get_messages_from_chat(chat_id, offset)
        )
        return await self.dump_items(messages, MessageModel)

    async def delete_message(
        self, chat_id: UUID4, user_id: str, message_id: int
    ) -> None:
        message = await self.check_item(message_id, chat_id, user_id, MessageNotFound)
        await self.repository.delete_item(message)
        return await self.model_dump(message, DeleteMessageModel)

    async def edit_message(
        self,
        chat_id: UUID4,
        user_id: UUID4,
        message_id: int,
        message: str | None,
    ) -> MessageModel:
        await self.check_item(
            message_id,
            chat_id,
            user_id,
            MessageNotFound,
        )

        edited_message = await self.repository.update_item(
            message_id,
            message=message,
        )

        return await self.model_dump(edited_message, MessageModel)

    async def read_message(self, user_id, chat_id, message_id) -> None:
        message = await self.check_item(message_id, chat_id, user_id, MessageNotFound)
        