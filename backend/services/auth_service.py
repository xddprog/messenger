from datetime import datetime, timedelta
import email

from fastapi.security import OAuth2PasswordRequestForm
from jwt import InvalidTokenError, encode, decode
from passlib.context import CryptContext
from pydantic import UUID4

from repositories.base import BaseRepository
from dto.auth_dto import LoginForm, RegisterForm, TokenModel
from dto.user_dto import UserBase
from database.models import User
from utils.config import load_jwt_config
from utils.errors.auth_errors import (
    InvalidLoginData, InvalidToken, 
    UserAlreadyNotRegister, UserAlreadyRegister
)


class AuthService:
    def __init__(self, repository: BaseRepository) -> None:
        self.repository = repository
        self.config = load_jwt_config()
        self.context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
    @staticmethod
    async def dump_user(user: User) -> UserBase:
        return UserBase.model_validate(user, from_attributes=True)
    
    async def get_user_by_email(self, email: str) -> User | None:
        user = await self.repository.get_by_attribute(self.repository.model.email, email)
        return None if not user else user[0]
    
    async def create_new_user(self, form: RegisterForm) -> User:
        return await self.repository.add_item(form.model_dump())
        
    async def hash_password(self, password: str) -> str:
        return self.context.hash(password)
    
    async def verify_password(self, password: str, hashed_password: str) -> bool:
        return self.context.verify(password, hashed_password)
    
    async def authenticate_user(self, form: LoginForm) -> User:
        user = await self.get_user_by_email(form.email)
        
        if not user:
            raise UserAlreadyNotRegister
        if not await self.verify_password(form.password, user.password):
            raise InvalidLoginData
        
        return await self.dump_user(user)
    
    async def create_access_token(self, username: str, user_id: UUID4) -> str:
        expire = datetime.now() + timedelta(minutes=self.config.access_token_time)
        data = {'sub': username, 'exp': expire}
        token = encode(data, self.config.jwt_secret, algorithm=self.config.algorithm)
        
        return token
    
    async def verify_token(self, token: str) -> dict:
        try: 
            payload = decode(token, self.config.jwt_secret, algorithms=[self.config.algorithm])
            email = payload.get('sub')
            
            if email is None:
                raise InvalidToken
            
            return email
        except InvalidTokenError:
            raise InvalidToken
    
    async def check_user_exist(self, email: str) -> User:
        user = await self.get_user_by_email(email)
        
        if user is None:
            raise InvalidToken
        
        return await self.dump_user(user)
    
    async def register_user(self, form: RegisterForm) -> str:
        user = await self.get_user_by_email(form.email)      

        if user:
            raise UserAlreadyRegister
        
        form.password = await self.hash_password(form.password)
        await self.create_new_user(form)
