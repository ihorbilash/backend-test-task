# Установить Docker.

Скачайте и установите Docker 

# Клонирование проекта

 создайте директорию для проекта:

sudo mkdir -p /test/backend-task
Клонируйте репозиторий проекта:

git clone https://github.com/ihorbilash/backend-test-task.git /test/backend-task

# Запуск

Перейдите в директорию проекта:
cd test/backend-task

Переименуйте файл .env.txt в .env:
добавте недостающие значения

Соберите проект с помощью Docker:

docker compose build

Запуск и остановка:

docker compose up
docker compose down


Документация по контроллерам