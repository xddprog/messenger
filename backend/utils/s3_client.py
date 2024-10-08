from uuid import uuid4

from fastapi import UploadFile


class S3Client:
    def __init__(self, client, bucket_name: str, endpoint_url: str):
        self.client = client
        self.bucket_name = bucket_name
        self.endpoint_url = endpoint_url

    async def upload_one_file(self, file: UploadFile, path: str):
        file_id = uuid4()
        path = f'{path}/{file_id}.{file.content_type.split("/")[1]}'
        await self.client.put_object(
            Bucket=self.bucket_name, Key=path, Body=file.file.read()
        )

        return f"{self.endpoint_url}/{self.bucket_name}/{path}"

    async def delete_one_file(self, path: str):
        await self.client.delete_object(Bucket=self.bucket_name, Key=path)

    async def upload_many_files(
        self, files: list[UploadFile], path: str
    ) -> list[str]:
        return [await self.upload_one_file(file, path) for file in files]

    async def delete_many_files(self, paths: list[str]) -> None:
        return [await self.delete_one_file(path) for path in paths]
