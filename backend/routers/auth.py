from email import message
from typing import Annotated
from fastapi import APIRouter, Cookie, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy import JSON

from dto.auth_dto import LoginForm, RegisterForm, TokenModel
from dto.user_dto import UserBase
from services import AuthService
from utils.dependencies import get_auth_service


router = APIRouter(
    prefix='/api/auth',
    tags=['auth']
)

@router.get('/current_user')
async def get_current_user(
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    token = Cookie(default=None),
) -> UserBase:
    username = await auth_service.verify_token(token)

    return await auth_service.check_user_exist(username)


@router.post('/login', status_code=200)
async def login_user(
    form: LoginForm,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    response: Response
):
    user = await auth_service.authenticate_user(form)

    token = await auth_service.create_access_token(form.email, user_id=user.id)
    response.set_cookie(key='token', value=token, httponly=True)

    return {'message': 'Вы успешно вошли в аккаунт!'}


@router.delete('/logout')
async def logout_user(response: Response):
    response.delete_cookie(key='token')
    return True


@router.post('/register', status_code=201)
async def register_user(
    form: RegisterForm,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    response: Response
):
    await auth_service.register_user(form)

    token = await auth_service.create_access_token(form.username, form.id)
    response.set_cookie(key='token', value=token, httponly=True)

    return {'message': 'Вы успешно зарегистрировались!'}
