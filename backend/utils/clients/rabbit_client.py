import json
from typing import Any
import aio_pika
from aio_pika.abc import AbstractQueue
from fastapi import HTTPException
from backend.utils.config.config import RabbitMQConfig


class RabbitClient:
    def __init__(self, config: RabbitMQConfig):
        self.config = config
        self.connection: aio_pika.Connection = None
        self.channel: aio_pika.Channel = None

    async def declare_queue(self, queue_name: str) -> AbstractQueue:
        return await self.channel.declare_queue(queue_name, durable=True)

    async def send_message(self, queue_name: str, message: str):
        await self.channel.default_exchange.publish(
            aio_pika.Message(body=message.encode("utf-8")), routing_key=queue_name
        )

    async def __call__(self) -> Any:
        self.connection = await aio_pika.connect_robust(
            host=self.config.host,
            port=self.config.port,
        )
        self.channel = await self.connection.channel()
        return self

    async def close(self):
        await self.connection.close()
        await self.channel.close()
