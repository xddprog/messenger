from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.models import User


base_url = "/api/auth"


async def test_register(async_client: AsyncClient):
    valid_register_response = await async_client.post(
        f"{base_url}/register",
        json={
            "id": "example1",
            "username": "example1",
            "password": "string",
            "email": "example1",
            "description": "string",
            "city": "string",
            "birthday": "2024-09-05T10:11:32Z",
        },
    )
    assert valid_register_response.status_code == 201

    user_already_exist_response = await async_client.post(
        f"{base_url}/register",
        json={
            "id": "example1",
            "username": "example1",
            "password": "string",
            "email": "example1",
            "description": "string",
            "city": "string",
            "birthday": "2024-09-05T10:11:33Z",
        },
    )
    assert user_already_exist_response.status_code == 403

    register_without_id_response = await async_client.post(
        f"{base_url}/register",
        json={
            "username": "example2",
            "password": "string",
            "email": "example2",
            "description": "string",
            "city": "string",
            "birthday": "2024-09-05T10:11:32Z",
        },
    )
    assert register_without_id_response.status_code == 201

    invalid_register_response = await async_client.post(
        f"{base_url}/register",
        json={
            "id": "example1",
            "username": "example1",
            "password": "string",
            "email": 123,
            "description": 123,
            "city": "string",
            "birthday": 123,
        },
    )
    assert invalid_register_response.status_code == 422

    await async_client.post(
        f"{base_url}/register",
        json={
            "id": "example3",
            "username": "example3",
            "password": "string",
            "email": "example3",
            "description": "string",
            "city": "string",
            "birthday": "2024-09-05T10:11:32Z",
        },
    )


async def test_login(async_client: AsyncClient):
    valid_login_response = await async_client.post(
        f"{base_url}/login", json={"email": "example1", "password": "string"}
    )
    assert valid_login_response.status_code == 200

    user_not_found_response = await async_client.post(
        f"{base_url}/login", json={"email": "example10", "password": "string"}
    )
    assert user_not_found_response.status_code == 404

    invalid_pass_response = await async_client.post(
        f"{base_url}/login", json={"email": "example1", "password": "string1212"}
    )
    assert invalid_pass_response.status_code == 401


async def test_get_current_user(async_client: AsyncClient, db_session: AsyncSession):
    login = await async_client.post(
        f"{base_url}/login", json={"email": "example1", "password": "string"}
    )
    token = login.json()["token"]

    valid_response = await async_client.get(
        f"{base_url}/current_user", headers={"Authorization": f"Bearer {token}"}
    )
    assert valid_response.status_code == 200

    invalid_token_response = await async_client.get(
        f"{base_url}/current_user", headers={"Authorization": "Bearer test"}
    )
    assert invalid_token_response.status_code == 401

    user = await db_session.get(User, "example1")
    await db_session.delete(user)
    await db_session.commit()

    invalid_user_response = await async_client.get(
        f"{base_url}/current_user", headers={"Authorization": f"Bearer {token}"}
    )
    assert invalid_user_response.status_code == 401
