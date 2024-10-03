
# Install Docker
Download and install Docker.

# Clone the project
Create a directory for the project:
sudo mkdir -p ~/test/backend-task

Clone the project repository:
git clone https://github.com/ihorbilash/backend-test-task.git /test/backend-task

# Run the project
Navigate to the project directory:
cd test/backend-task

Rename the .env.txt file to .env and add missing values.

Build the project using Docker:
docker compose build

Start and stop the project:
docker compose up
docker compose down

# Swagger

To access Swagger documentation for the API, visit:
GET /doc
example: http://localhost:8080/doc

# phpMyAdmin
To access phpMyAdmin for manage db, visit:
port 3306
example http://localhost:3306

# Authentication (Google OAuth2)
Once you receive the JWT token from this endpoint, add it to the Swagger documentation as the bearer token for authenticating other API requests.

GET /api/auth/google/login
Description: Initiates Google OAuth authorization.
Requires authentication: No

GET /api/auth/google/redirect
Description: Handles the redirect after successful Google OAuth authorization and returns a JWT token.
Requires authentication: No



# API Description (Endpoints)

File Operations
POST /api/files/upload
Description: Uploads a file with a size limit of 10 MB and file types (jpg, jpeg, png, gif, pdf).
Requires authentication: Yes
Parameters:
-file: file (required)
-folderId: ID of the folder to upload the file to (optional)

GET /api/files/download/:fileId/:folderId
Description: Downloads a file by ID and folder ID.
Requires authentication: Yes

DELETE /api/files/delete-file/:fileId
Description: Deletes a file by its ID.
Requires authentication: Yes

Folder Operations
POST /api/folders/create/:folderName/:parentFolderId
Description: Creates a folder. If parentFolderId is not specified, the folder will be a root folder.
Requires authentication: Yes

POST /api/folders/:folderId/editFolderName
Description: Edits the folder name by its ID.
Requires authentication: Yes

POST /api/folders/:folderId/delete
Description: Deletes a folder by its ID. All nested files and subfolders will also be deleted.
Requires authentication: Yes

GET /api/folders/folder-tree/:folderId
Description: Retrieves the structure of nested folders and files by folder ID.
Requires authentication: Yes

Permission Management
POST /api/permissions/file/permit
Description: Assigns permissions for a file (view and/or edit) to a user by email.
Requires authentication: Yes
Parameters:
-fileId: ID of the file
-userEmail: User's email
-canEdit: Edit permission (true/false)

POST /api/permissions/folder/permit
Description: Assigns permissions for a folder (view and/or edit) to a user by email.
Requires authentication: Yes
Parameters:
-folderId: ID of the folder
-userEmail: User's email
-canEdit: Edit permission (true/false)













# Установить Docker.

Скачайте и установите Docker 

# Клонирование проекта

 создайте директорию для проекта:

sudo mkdir -p ~/test/backend-task
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
# Документация по контроллерам

# Описание API (эндпоинты)
1. Аутентификация (Google OAuth2)

GET /api/auth/google/login
Описание: Инициализация Google OAuth авторизации.
Требует аутентификацию: Нет

GET /api/auth/google/redirect
Описание: Обработка редиректа после успешной Google OAuth авторизации и возврат JWT токена.
Требует аутентификацию: Нет

2. Работа с файлами

POST /api/files/upload
Описание: Загрузка файла с поддержкой ограничения на размер (10 MB) и типы файлов (jpg, jpeg, png, gif, pdf).
Требует аутентификацию: Да
Параметры:
file: файл (обязательный параметр)
folderId: ID папки, куда загружается файл (опционально)

GET /api/files/download/:fileName/:folderId
Описание: Загрузка файла по его имени и ID папки.
Требует аутентификацию: Да

DELETE /api/files/delete-file/:fileId
Описание: Удаление файла по его ID.
Требует аутентификацию: Да

3. Работа с папками

POST /api/folders/create/:folderName/:parentFolderId
Описание: Создание папки. Если parentFolderId не указан, папка будет корневой.
Требует аутентификацию: Да

POST /api/folders/:folderId/editFolderName
Описание: Редактирование имени папки по её ID.
Требует аутентификацию: Да

POST /api/folders/:folderId/delete
Описание: Удаление папки по её ID. Все вложенные файлы и подпапки также будут удалены.
Требует аутентификацию: Да

GET /api/folders/folder-tree/:folderId
Описание: Получение структуры вложенных папок и файлов по ID папки.
Требует аутентификацию: Да

4. Управление разрешениями

POST /api/permissions/file/permit
Описание: Назначение разрешений на файл (просмотр и/или редактирование) для пользователя по email.
Требует аутентификацию: Да
Параметры:

fileId: ID файла
userEmail: Email пользователя
canEdit: Возможность редактирования (true/false)
POST /api/permissions/folder/permit
Описание: Назначение разрешений на папку (просмотр и/или редактирование) для пользователя по email.
Требует аутентификацию: Да
Параметры:
folderId: ID папки
userEmail: Email пользователя
canEdit: Возможность редактирования (true/false)

