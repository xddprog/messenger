# Social Network 

Учебный проект социальной сети, со всеми возможностями подобных сервисов

<img width="400" alt="Снимок экрана 2024-10-21 в 01 07 04" src="https://github.com/user-attachments/assets/78ebdbb3-ca33-4e79-88fe-71a4b49e1e13"> <img width="400" alt="Снимок экрана 2024-10-21 в 01 04 40" src="https://github.com/user-attachments/assets/7408cabd-25fb-4582-98d4-4b2492375336">
<img width="400" alt="Снимок экрана 2024-10-21 в 01 03 58" src="https://github.com/user-attachments/assets/b5d0525c-78ed-4648-9aa6-5d9373995c52"> <img width="400" alt="Снимок экрана 2024-10-21 в 01 03 47" src="https://github.com/user-attachments/assets/c2c4b904-ec2d-442b-96a7-b8b82838cd06">

## Используемые Backend технологии:
1. **FastAPI**  
2. **SQLAlchemy**  
3. **Redis**
4. **PostgreSQL**
5. **Ruff**
   
## Используемые Frontend технологии:
1. **React**  
2. **Tailwind**
3. **Ant Design**
4. **Axios**

## Дополнительные сервисы:

1. **Yandex Object Storage**:  
   Для хранения и управления большими объемами мультимедийных данных (фотографий, видео и т.д.) используется Yandex Object Storage
2. **Here Geocodig**:
  Используется для автокомплита городов

## Возможности приложения:
- Профили пользователей
- Друзья
- Посты
- Чаты
- Сообщества

##Планируемые возможности:
- Заметки
- Более гибкие настройки
- Голосовые и видео звонки

## Запуск в командной строке
1. Настроить переменные окружения .env
2. Установка frontend зависимостей, запуск frontend'a
```
cd frontend && npm install && npm run dev 
```
3. Установка backend зависимостей, запуск backend'a
```
pip install -r backend/requirements.txt && uvicorn backend.main:app --reload
```   

## Запуска с помощью Docker'а
- In Future
