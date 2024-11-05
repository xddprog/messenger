import base64
import pprint
from tempfile import SpooledTemporaryFile
from uuid import uuid4
from cffi.cffi_opcode import PRIM_BOOL
from fastapi import HTTPException, UploadFile
from pydantic import UUID4

from backend.database.models import Message, User, Chat
from backend.dto.message_dto import (
    DeleteMessageModel,
    MessageModel,
    MessageTypes,
)
from backend.errors.message_errors import MessageNotFound
from backend.errors.user_errors import UserAlreadyreadMessage
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
        self,
        message_id: int,
        chat_id: UUID4,
        user_id: str,
        error: HTTPException,
        check_user: bool = True,
    ) -> Message:
        message = await self.repository.get_item(message_id)

        if not message:
            raise error
        elif message.chat_fk != chat_id:
            raise error
        elif check_user and message.user_fk != user_id:
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
        self, message: str, images: list[dict], user_id: str, chat_id: UUID4
    ) -> MessageModel:
        if images:
            images = await self.convert_message_images(
                images, f"{chat_id}/messages/{user_id}"
            )

        new_message = await self.repository.add_item(
            message=message, user_id=user_id, chat_id=chat_id, images=images
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
        message = await self.check_item(
            message_id, chat_id, user_id, MessageNotFound
        )
        await self.repository.delete_item(message)
        return await self.model_dump(message, DeleteMessageModel)

    async def edit_message(
        self,
        chat_id: UUID4,
        user_id: str,
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

    async def read_message(
        self, user: User, chat_id: UUID4, message_id: UUID4
    ) -> None:
        message = await self.check_item(
            message_id, chat_id, user.id, MessageNotFound, check_user=False
        )
        if user in message.users_who_readed:
            raise UserAlreadyreadMessage()

        await self.repository.read_message(message, user)
        message = await self.repository.get_item(message_id)
        return await self.model_dump(message, MessageModel)

    async def handle_message_in_websocket(
        self,
        type_: str,
        chat_id: UUID4,
        client_id: str,
        message_id: int,
        data: dict,
    ) -> MessageModel:
        if type_ == MessageTypes.DELETE:
            return await self.delete_message(chat_id, client_id, message_id)
        elif type_ == MessageTypes.EDIT:
            return await self.edit_message(
                chat_id, client_id, message_id, data.get("message")
            )
        elif type_ == MessageTypes.READ:
            return await self.read_message(client_id, chat_id, message_id)
        elif type_ == MessageTypes.CREATE:
            return await self.create_message(
                data.get("message"), data.get("images"), client_id, chat_id
            )
