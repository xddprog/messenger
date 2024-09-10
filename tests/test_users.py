from httpx import AsyncClient


base_url = "/api/users"


async def test_get_user(async_client: AsyncClient):
    login = await async_client.post(
        "/api/auth/login", json={"email": "example1", "password": "string"}
    )
    headers = {"Authorization": f'Bearer {login.json()["token"]}'}

    get_other_user = await async_client.get(f"{base_url}/example3", headers=headers)
    assert get_other_user.status_code == 200

    get_not_exist_user = await async_client.get(
        f"{base_url}/undefined", headers=headers
    )
    assert get_not_exist_user.status_code == 404

    get_all_users = await async_client.get(f"{base_url}/all", headers=headers)
    assert get_all_users.status_code == 200


async def test_user_add_friend(async_client: AsyncClient):
    login = await async_client.post(
        "/api/auth/login", json={"email": "example1", "password": "string"}
    )
    user = login.json()["user"]["id"]
    headers = {"Authorization": f'Bearer {login.json()["token"]}'}

    add_friend_to_user = await async_client.post(
        f"{base_url}/{user}/friends/add/example3", headers=headers
    )
    assert add_friend_to_user.status_code == 200

    remove_friend_to_user = await async_client.delete(
        f"{base_url}/{user}/friends/remove/example3", headers=headers
    )
    assert remove_friend_to_user.status_code == 200

    add_not_exist_users_to_friend = await async_client.post(
        f"{base_url}/{user}/friends/add/example10", headers=headers
    )
    assert add_not_exist_users_to_friend.status_code == 404

    remove_not_exist_users_to_friend = await async_client.delete(
        f"{base_url}/{user}/friends/remove/example10", headers=headers
    )
    assert remove_not_exist_users_to_friend.status_code == 404

    await async_client.post(f"{base_url}/{user}/friends/add/example3", headers=headers)


async def test_get_user_rows(async_client: AsyncClient):
    login = await async_client.post(
        "/api/auth/login", json={"email": "example1", "password": "string"}
    )
    user = login.json()["user"]["id"]
    headers = {"Authorization": f'Bearer {login.json()["token"]}'}

    get_user_chats = await async_client.get(f"{base_url}/{user}/chats", headers=headers)
    assert get_user_chats.status_code == 200

    get_user_posts = await async_client.get(f"{base_url}/{user}/posts", headers=headers)
    assert get_user_posts.status_code == 200

    get_user_all_friends = await async_client.get(
        f"{base_url}/{user}/friends/all", headers=headers
    )
    assert get_user_all_friends.status_code == 200

    get_user_one_friend = await async_client.get(
        f"{base_url}/{user}/friends/example3", headers=headers
    )
    assert get_user_one_friend.status_code == 200

    get_user_not_exist_friend = await async_client.get(
        f"{base_url}/{user}/friends/undefined", headers=headers
    )
    assert get_user_not_exist_friend.status_code == 404
