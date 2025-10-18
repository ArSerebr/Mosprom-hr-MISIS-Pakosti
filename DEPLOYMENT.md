# Инструкция по запуску проекта Mosprom HR MISIS

## ✅ Статус проекта
**Проект полностью готов к запуску!** Все Docker конфигурации проверены и исправлены.

### Последние исправления:
- ✅ Исправлены ошибки TypeScript компиляции
- ✅ Добавлено поле `applications` в интерфейс `Vacancy`
- ✅ Исправлено предупреждение ESLint в `useEffect`
- ✅ Добавлено поле `status` при создании вакансии
- ✅ Все сервисы запускаются без ошибок

## Предварительные требования

- Docker и Docker Compose установлены на системе
- Git для клонирования репозитория

## 🚀 Быстрый запуск

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd Mosprom-hr-MISIS-Pakosti
```

### 2. Запуск через Docker Compose
```bash
# Запуск всех сервисов
docker-compose up --build

# Или в фоновом режиме
docker-compose up -d --build
```

### 3. Доступ к приложению
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Исправленные проблемы

- ✅ Добавлена зависимость `python-multipart` для работы с формами
- ✅ Исправлен Dockerfile фронтенда для корректной работы с Next.js
- ✅ Настроена связь между фронтендом и бэкендом через Docker network
- ✅ Добавлен volume для SQLite базы данных
- ✅ Убрано устаревшее предупреждение о версии Docker Compose

## Разработка

### Локальная разработка (без Docker)

#### Backend
```bash
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация виртуального окружения
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend

# Установка зависимостей
npm install

# Создание файла .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Запуск в режиме разработки
npm run dev
```

## Структура проекта

```
├── backend/                 # FastAPI backend
│   ├── auth/               # Модуль аутентификации
│   ├── vacancies/          # Модуль вакансий
│   ├── internship/         # Модуль стажировок
│   ├── main.py            # Точка входа FastAPI
│   ├── database.py        # Конфигурация БД
│   ├── requirements.txt    # Python зависимости
│   └── Dockerfile         # Docker образ для backend
├── frontend/               # Next.js frontend
│   ├── app/               # App Router страницы
│   ├── components/        # React компоненты
│   ├── lib/              # Утилиты и API клиент
│   ├── types/            # TypeScript типы
│   ├── package.json      # Node.js зависимости
│   └── Dockerfile        # Docker образ для frontend
└── docker-compose.yml     # Конфигурация Docker Compose
```

## API Endpoints

### Вакансии
- `GET /api/vacancies/read` - Получить все активные вакансии
- `POST /api/vacancies/create` - Создать новую вакансию
- `PUT /api/vacancies/{id}` - Обновить вакансию
- `GET /api/vacancies/my_vacancies` - Получить вакансии пользователя
- `POST /api/vacancies/applications` - Подать заявку на вакансию

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/logout` - Выход из системы

## Переменные окружения

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend
```env
PYTHONUNBUFFERED=1
```

## Полезные команды

```bash
# Просмотр логов
docker-compose logs -f

# Остановка сервисов
docker-compose down

# Пересборка образов
docker-compose build --no-cache

# Очистка Docker
docker system prune -a
```

## Решение проблем

### Порт уже занят
```bash
# Проверить какие процессы используют порты
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Остановить контейнеры
docker-compose down
```

### Проблемы с правами доступа
```bash
# Linux/Mac - дать права на выполнение
chmod +x scripts/*.sh
```

### Очистка кэша Docker
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## Production развертывание

1. Обновите переменные окружения в `docker-compose.yml`
2. Настройте домены и SSL сертификаты
3. Используйте внешнюю базу данных вместо SQLite
4. Настройте мониторинг и логирование

```bash
# Production запуск
docker-compose -f docker-compose.prod.yml up -d
```
