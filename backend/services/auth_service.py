from datetime import datetime, timedelta
from time import perf_counter

from aiohttp import ClientSession
from fastapi.security import HTTPBearer
from jwt import InvalidTokenError, encode, decode
from passlib.context import CryptContext
from requests import get

from backend.dto.auth_dto import LoginForm, RegisterForm
from backend.dto.user_dto import BaseUserModel
from backend.database.models import User
from backend.services.base_service import BaseService
from backend.errors.auth_errors import (
    InvalidLoginData,
    InvalidToken,
    UserAlreadyNotRegister,
    UserAlreadyRegister,
)
from backend.utils.config.config import HERE_GEOCODING_API_KEY, JWT_CONFIG


class AuthService(BaseService):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
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
        time = perf_counter()
        if not await self.verify_password(form.password, user.password):
            raise InvalidLoginData

        print(f"authenticate_user: {perf_counter() - time:.10f} seconds")
        return await self.model_dump(user, BaseUserModel)

    async def create_access_token(self, email: str) -> str:
        expire = datetime.now() + timedelta(
            minutes=JWT_CONFIG.jwt_access_token_time
        )
        data = {"sub": email, "exp": expire}
        token = encode(
            data, JWT_CONFIG.jwt_secret, algorithm=JWT_CONFIG.jwt_algorithm
        )

        return token

    async def verify_token(self, token: HTTPBearer) -> dict[str, str]:
        try:
            payload = decode(
                token.credentials,
                JWT_CONFIG.jwt_secret,
                algorithms=[JWT_CONFIG.jwt_algorithm],
            )
            email = payload.get("sub")

            if email is None:
                raise InvalidToken

            return email
        except (InvalidTokenError, AttributeError):
            raise InvalidToken

    async def check_user_exist(self, email: str) -> User:
        user = await self.get_user_by_email(email)

        if user is None:
            raise InvalidToken

        return user

    async def register_user(self, form: RegisterForm) -> User:
        user = await self.get_user_by_email(form.email)

        if user:
            raise UserAlreadyRegister

        form.password = await self.hash_password(form.password)
        new_user = await self.repository.add_item(**form.model_dump())

        return await self.model_dump(new_user, BaseUserModel)

    async def   search_cities(self, city: str) -> list[str]:
        url = "https://autocomplete.search.hereapi.com/v1/autocomplete"
        params = {
            "apiKey": HERE_GEOCODING_API_KEY,
            "q": city,
            "types": "city",
            "lang": "ru-RU",
            "limit": 20,
        }
        async with ClientSession() as session:
            async with session.get(url, params=params) as response:
                response.raise_for_status()
                response = await response.json()

        return [city["address"]["label"] for city in response.get("items")]
