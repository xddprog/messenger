from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy import Table

from backend.repositories import BaseRepository
from backend.utils.s3_client import S3Client


class BaseService:
    def __init__(self, repository: BaseRepository, s3_client: S3Client):
        self.repository = repository
        self.s3_client = s3_client

    @staticmethod
    async def check_item(item, error: HTTPException):
        if not item:
            raise error

    @staticmethod
    async def model_dump(db_model: Table, dto_model: BaseModel) -> BaseModel:
        return dto_model.model_validate(db_model, from_attributes=True)

    async def dump_items(self, db_models: list[Table], dto_model: BaseModel) -> list[BaseModel] | None:
        return [await self.model_dump(model, dto_model) for model in db_models]
