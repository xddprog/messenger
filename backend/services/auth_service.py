from datetime import datetime, timedelta

from jwt import InvalidTokenError, encode, decode
from passlib.context import CryptContext

from dto.auth_dto import LoginForm, RegisterForm
from dto.user_dto import BaseUserModel
from database.models import User
from services.base_service import BaseService
from utils.config.config import load_jwt_config
from utils.errors.auth_errors import (
    InvalidLoginData, InvalidToken, 
    UserAlreadyNotRegister, UserAlreadyRegister
)


class AuthService(BaseService):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.config = load_jwt_config()
        self.context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
    @staticmethod
    async def dump_user(user: User) -> BaseUserModel:
        return BaseUserModel.model_validate(user, from_attributes=True)
    
    async def get_user_by_email(self, email: str) -> User | None:
        user = await self.repository.get_by_attribute(self.repository.model.email, email)
        return None if not user else user[0]
        
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
    
    async def create_access_token(self, username: str) -> str:
        expire = datetime.now() + timedelta(minutes=self.config.access_token_time)
        data = {'sub': username, 'exp': expire}
        token = encode(data, self.config.jwt_secret, algorithm=self.config.algorithm)
        
        return token.decode()
    
    async def verify_token(self, token: str) -> dict:
        try:
            payload = decode(token, self.config.jwt_secret, algorithms=[self.config.algorithm])
            email = payload.get('sub')
            
            if email is None:
                raise InvalidToken
            
            return email
        except InvalidTokenError as e:
            raise InvalidToken
    
    async def check_user_exist(self, email: str) -> User:
        user = await self.get_user_by_email(email)
        
        if user is None:
            raise InvalidToken
        
        return await self.dump_user(user)
    
    async def register_user(self, form: RegisterForm) -> User:
        user = await self.get_user_by_email(form.email)      

        if user:
            raise UserAlreadyRegister
        
        form.password = await self.hash_password(form.password)
        new_user = await self.repository.add_item(**form.model_dump())

        return await self.model_dump(new_user, BaseUserModel)
