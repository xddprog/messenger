from uuid import uuid4
from httpx import AsyncClient


base_url = "/api/posts"


async def test_create_post(async_client: AsyncClient):
    register = await async_client.post(
        "/api/auth/register",
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
    headers = {
        "Authorization": f'Bearer {register.json()["token"]}',
        "content-type": "application/x-www-form-urlencoded",
    }

    file = open("tests/images/test_image.jpg", "rb")
    create_with_image_response = await async_client.post(
        f"{base_url}/create",
        data="author=example1&description=test",
        headers=headers,
        files={"images": ("filename", file, "image/jpg")},
    )
    assert create_with_image_response.status_code == 201

    create_without_image_response = await async_client.post(
        f"{base_url}/create", data="author=example1&description=test", headers=headers
    )
    assert create_without_image_response.status_code == 201

    invalid_author_response = await async_client.post(
        f"{base_url}/create",
        data="author=invalid&description=invalid",
        files={"images": ("filename", file, "image/jpg")},
        headers=headers,
    )
    assert invalid_author_response.status_code == 404


async def test_get_posts(async_client: AsyncClient):
    login = await async_client.post(
        "/api/auth/login", json={"email": "example1", "password": "string"}
    )
    headers = {"Authorization": f'Bearer {login.json()["token"]}'}

    file = open("tests/images/test_image.jpg", "rb")
    create_with_image_response = await async_client.post(
        f"{base_url}/create",
        data="author=example1&description=test",
        headers={
            "Authorization": f'Bearer {login.json()["token"]}',
            "content-type": "application/x-www-form-urlencoded",
        },
        files={"images": ("filename", file, "image/jpg")},
    )
    test_post = create_with_image_response.json()["id"]

    get_all_posts = await async_client.get(f"{base_url}/all", headers=headers)
    assert get_all_posts.status_code == 200

    get_one_post = await async_client.get(f"{base_url}/{test_post}", headers=headers)
    assert get_one_post.status_code == 200

    delete_post = await async_client.delete(f"{base_url}/{test_post}", headers=headers)
    assert delete_post.status_code == 200

    delete_not_exist_post = await async_client.delete(
        f"{base_url}/{test_post}", headers=headers
    )
    assert delete_not_exist_post.status_code == 404

    get_not_exist_post = await async_client.get(
        f"{base_url}/{test_post}", headers=headers
    )
    assert get_not_exist_post.status_code == 404

    get_post_with_invalid_id = await async_client.delete(
        f"{base_url}/undefined", headers=headers
    )
    assert get_post_with_invalid_id.status_code == 422


async def test_like_post(async_client: AsyncClient):
    login = await async_client.post(
        "/api/auth/login", json={"email": "example1", "password": "string"}
    )
    user = login.json()["user"]["id"]
    headers = {"Authorization": f'Bearer {login.json()["token"]}'}

    file = open("tests/images/test_image.jpg", "rb")
    create_with_image_response = await async_client.post(
        f"{base_url}/create",
        data="author=example1&description=test",
        headers={
            "Authorization": f'Bearer {login.json()["token"]}',
            "content-type": "application/x-www-form-urlencoded",
        },
        files={"images": ("filename", file, "image/jpg")},
    )
    test_post = create_with_image_response.json()["id"]

    like_not_exist_post = await async_client.patch(
        f"{base_url}/{uuid4()}/like/{user}", headers=headers
    )
    assert like_not_exist_post.status_code == 404

    like_exist_post = await async_client.patch(
        f"{base_url}/{test_post}/like/{user}", headers=headers
    )
    assert like_exist_post.status_code == 200

    like_not_exist_user = await async_client.patch(
        f"{base_url}/{test_post}/like/undefined", headers=headers
    )
    assert like_not_exist_user.status_code == 404
