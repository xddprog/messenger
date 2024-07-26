from email import message
from typing import Annotated
from fastapi import APIRouter, Cookie, Depends, Response

from dto.auth_dto import LoginForm, RegisterForm
from dto.user_dto import BaseUserModel
from services import AuthService
from utils.dependencies import get_auth_service, get_current_user_dependency

router = APIRouter(
    prefix='/api/auth',
    tags=['auth']
)


@router.get('/current_user')
async def get_current_user(current_user: BaseUserModel = Depends(get_current_user_dependency)):
    return current_user


@router.post('/login', status_code=200)
async def login_user(
    form: LoginForm,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    response: Response
):
    await auth_service.authenticate_user(form)

    token = await auth_service.create_access_token(form.email)
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
    new_user = await auth_service.register_user(form)
    token = await auth_service.create_access_token(new_user.username)
    response.set_cookie(key='token', value=token, httponly=True)

    return {
        'message': 'Вы успешно зарегистрировались!',
        'new_user': new_user
    }
