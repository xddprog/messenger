from environs import Env
from pydantic import BaseModel


env = Env()
env.read_env()


class DatabaseConfig(BaseModel):
    db_name: str
    db_user: str
    db_pass: str
    db_host: str
    db_port: str

    @property
    def url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_pass}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


class JwtConfig(BaseModel):
    jwt_secret: str
    jwt_algorithm: str
    jwt_access_token_time: int


class S3StorageConfig(BaseModel):
    aws_bucket_name: str
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    aws_endpoint_url: str


class RedisConfig(BaseModel):
    redis_host: str
    redis_port: int


class RabbitMQConfig(BaseModel):
    rabbit_host: str
    rabbit_port: int


DB_CONFIG = DatabaseConfig(
    **{field: env.str(field.upper()) for field in DatabaseConfig.model_fields}
)
JWT_CONFIG = JwtConfig(
    **{field: env.str(field.upper()) for field in JwtConfig.model_fields}
)
REDIS_CONFIG = RedisConfig(
    **{field: env.str(field.upper()) for field in RedisConfig.model_fields}
)
RABBITMQ_CONFIG = RabbitMQConfig(
    **{field: env.str(field.upper()) for field in RabbitMQConfig.model_fields}
)
S3_STORAGE_CONFIG = S3StorageConfig(
    **{field: env.str(field.upper()) for field in S3StorageConfig.model_fields}
)
HERE_GEOCODING_API_KEY = env.str("HERE_GEOCODING_API_KEY")