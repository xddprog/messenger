from datetime import datetime, timedelta
from time import perf_counter

from fastapi.security import HTTPBearer
from jwt import InvalidTokenError, encode, decode
from passlib.context import CryptContext
from requests import get

from backend.dto.auth_dto import LoginForm, RegisterForm
from backend.dto.user_dto import BaseUserModel
from backend.database.models import User
from backend.services.base_service import BaseService
from backend.utils.config.config import (
    load_here_geocoding_api_key,
    load_jwt_config,
)
from backend.errors.auth_errors import (
    InvalidLoginData,
    InvalidToken,
    UserAlreadyNotRegister,
    UserAlreadyRegister,
)


class AuthService(BaseService):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.config = load_jwt_config()
        self.context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    async def get_user_by_email(self, email: str) -> User | None:
        user = await self.repository.get_by_attribute(
            self.repository.model.email, email
        )
        return None if not user else user[0]

    async def hash_password(self, password: str) -> str:
        return self.context.hash(password)

    async def verify_password(
        self, password: str, hashed_password: str
    ) -> bool:
        return self.context.verify(password, hashed_password)

    async def authenticate_user(self, form: LoginForm) -> User:
        user = await self.get_user_by_email(form.email)

        if not user:
            raise UserAlreadyNotRegister
        if not await self.verify_password(form.password, user.password):
            raise InvalidLoginData

        return await self.model_dump(user, BaseUserModel)

    async def create_access_token(self, email: str) -> str:
        expire = datetime.now() + timedelta(
            minutes=self.config.access_token_time
        )
        data = {"sub": email, "exp": expire}
        token = encode(
            data, self.config.jwt_secret, algorithm=self.config.algorithm
        )

        return token

    async def verify_token(self, token: HTTPBearer) -> dict[str, str]:
        try:
            payload = decode(
                token.credentials,
                self.config.jwt_secret,
                algorithms=[self.config.algorithm],
            )
            email = payload.get("sub")

            if email is None:
                raise InvalidToken

            return email
        except (InvalidTokenError, AttributeError):
            raise InvalidToken

    async def check_user_exist(self, email: str) -> User:
        start = perf_counter()
        user = await self.get_user_by_email(email)

        if user is None:
            raise InvalidToken

        end = perf_counter()
        print(f"check_user_exist: {end - start:.10f} seconds")

        return user

    async def register_user(self, form: RegisterForm) -> User:
        user = await self.get_user_by_email(form.email)

        if user:
            raise UserAlreadyRegister

        form.password = await self.hash_password(form.password)
        new_user = await self.repository.add_item(**form.model_dump())

        return await self.model_dump(new_user, BaseUserModel)

    async def search_cities(self, city: str) -> list[str]:
        url = "https://autocomplete.search.hereapi.com/v1/autocomplete"
        params = {
            "apiKey": await load_here_geocoding_api_key(),
            "q": city,
            "types": "city",
            "lang": "ru-RU",
            "limit": 20,
        }
        response = get(url, params).json()

        return [city["address"]["label"] for city in response.get("items")]
