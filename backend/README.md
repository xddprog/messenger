# API Endpoints
Все эндпоинты начинаются с /api

Все файлы будут возвращаться в виде ссылок из s3 хранилища

## Auth

### 1. GET /auth/current_user
Проверяет наличие и действительность JWT токена пользователя и Cookie

Ответ 200:

```json
{
    "id": "d599497f-238c-40e8-917e-fd11646476f0",
    "username": "string",
    "email": "string"
}
```

Ответ 401:

```json
{
  "detail": "Не удалось подтвердить учетные данные"
}
```
### 2. POST /auth/register

Регистрация нового пользователя

```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

Ответ 201:

```json
{
    "message": "Вы успешно зарегистрировались!",
    "new_user": {
        "id": "uuid4",
        "username": "string",
        "email": "string",
        "avatar": "string"
    }
}
```

Ответ 403:

Некорректный токен

```json
{
    "detail": "Не удалось подтвердить учетные данные"
}
```

### 3. POST /auth/login

Вход в аккаунт

Ожидаемые данные:

```json
{
    "email": "string",
    "password": "string"
}
```

Ответ 200:

```json
{
    "detail": "Вы успешно вошли в аккаунт!",
    "user": {
        "id": "uuid4",
        "username": "string",
        "email": "string",
        "avatar": "string"
    }
}
```

Ответ 404:

Пользователь не зарегистрирован

```json
{
    "detail": "Пользователь с таким именем не найден!"
}
```

Ответ 401:

Пользователь ввел неверные данные

```json
{
    "detail": "Проверьте введеные данные!"
}
```

Ответ 401:

Пользователь ввел неверные данные

```json
{
    "detail": "Проверьте введеные данные!"
}
```

### 4. DELETE /auth/logout

Выход из аккаунта

Ответ 200:
```json
{
  "detail": "Вы успешно вышли из аккаунта"
}
```

## Posts
### 1. POST /auth/create
Создание нового поста

Форма должна иметь headers: 

```json
{
    "content-type": "multipart/form-data"
}
```

Ожидаемые данные:
```json
{
    "author": "uuid4",
    "description": "string",
    "images": []
}
```

Ответ 201:
```json
{
    "id": "uuid4",
    "author": {
        "id": "uuid4",
        "username": "string",
        "avatar": "string || null"
    },
    "description": "string",
    "images": [],
    "likes": [],
    "created_at": "string",
    "views": 0
}
```

### 2. GET /posts/all 
Возвращает все посты(хотелось бы конечно, чтоб рекомендации, но пока просто все посты)


Ответ 201:

```json
{
    "id": "uuid4",
    "author": {
        "id": "uuid4",
        "username": "string",
        "avatar": "string || null"
    },
    "description": "string",
    "images": ["string"],
    "likes": [
        {
            "id": "uuid4",
            "username": "string",
            "email": "string",
            "avatar": "string"
        }
    ],
    "created_at": "string",
    "views": 0
}
```

### 3. PATCH /posts/:post_id/like/:user_id
Лайк поста

Ответ 200:

```json
{
    "id": "uuid4",
    "author": {
        "id": "uuid4",
        "username": "string",
        "avatar": "string || null"
    },
    "description": "string",
    "images": ["string"],
    "likes": [
        {
            "id": "uuid4",
            "username": "string",
            "email": "string",
            "avatar": "string"
        }
    ],
    "created_at": "string",
    "views": 0
}
```

## Chats

### 1. POST /chats/create
Создание чата

Ожидаемые данные: 
```json
{
  
}
```

Ответ 201: 
```json
{
    "id": "uuid4",
    "title": "string",
    "avatar": "string",
    "users": [
        {
            "id": "uuid4",
            "username": "string",
            "email": "string",
            "avatar": "string"
        }
    ]
}
```
### 2. GET /chats/:chat_id/messages/:offset

Получение сообщений 

```json
{
    "id": "integer",
    "message": "string",
    "created_at": "string",
    "user": {
        "id": "uuid4",
        "username": "string",
        "email": "string",
        "avatar": "string"
    }
}
```

### 3. Websocket /chats/ws/:chat_id/:client_id

Отправка сообщений

Ответ:
```json
{
  "id": "integer",
    "message": "string",
    "created_at": "string",
    "user": {
        "id": "uuid4",
        "username": "string",
        "email": "string",
        "avatar": "string"
    }
}
```

## Users

### 1. GET /users/:user_id/chats
Получение чатов пользователя

Ответ 200:
```json
[
    {
        "id": "uuid4",
        "title": "string",
        "avatar": "string",
        "users": [
            {
                "id": "uuid4",
                "username": "string",
                "email": "string",
                "avatar": "string"
            }
        ]
    }
]
```

### 2. GET /users/:user_id/:posts

Получение постов пользователя

Ответ:
```json
[ 
    {
        "id": "uuid4",
        "author": {
            "id": "uuid4",
            "username": "string",
            "avatar": "string || null"
        },
        "description": "string",
        "images": ["string"],
        "likes": [
            {
                "id": "uuid4",
                "username": "string",
                "email": "string",
                "avatar": "string"
            }
        ],
        "created_at": "string",
        "views": 0
    }
]
```

### 3. GET /users/friends/all

Получение всех друзей пользователя

Ответ:
```json
[
    {
        "id": "uuid4",
        "username": "string",
        "email": "string",
        "avatar": "string"
    }
]
```

### 4. GET /users/:user_id/friends/:friend_id

Проверка, является ли польователь другом

```json
{
    "user_is_friend": true
}
```

### 5. POST /users/:user_id/friends/add/:friend_id

Добавление пользователя в друзья

```json
{
  "detail": "Пользователь EXAMPLE_USER успешно добавил EXAMPLE_FRIEND в друзья"
}
```

### 6. POST /users/:user_id/friends/remove/:friend_id

Добавление пользователя в друзья

```json
{
  "detail": "Пользователь EXAMPLE_USER успешно удалил EXAMPLE_FRIEND из друзей"
}
```