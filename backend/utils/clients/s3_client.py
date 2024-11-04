from uuid import uuid4

from fastapi import UploadFile
from aiobotocore.session import AioSession

from backend.utils.config.config import S3StorageConfig


class S3Client:
    def __init__(self, config: S3StorageConfig):
        self.config = config
        self.client = None

    async def get_client(self):
        session = AioSession()
        async with session.create_client(
            "s3",
            aws_access_key_id=self.config.access_key_id,
            aws_secret_access_key=self.config.secret_access_key,
            endpoint_url=self.config.endpoint_url,
            region_name=self.config.region,
        ) as client:
            return client

    async def upload_one_file(self, file: UploadFile, path: str):
        file_id = uuid4()
        path = f'{path}/{file_id}.{file.content_type.split("/")[1]}'

        await self.client.put_object(
            Bucket=self.config.bucket_name, Key=path, Body=file.file
        )

        return f"{self.config.endpoint_url}/{self.config.bucket_name}/{path}"

    async def delete_one_file(self, path: str):
        await self.client.delete_object(
            Bucket=self.config.bucket_name, Key=path
        )

    async def upload_many_files(
        self, files: list[UploadFile], path: str
    ) -> list[str]:
        return [await self.upload_one_file(file, path) for file in files]

    async def delete_many_files(self, paths: list[str]) -> None:
        return [await self.delete_one_file(path) for path in paths]

    async def __call__(self):
        self.client = await self.get_client()

        return self
