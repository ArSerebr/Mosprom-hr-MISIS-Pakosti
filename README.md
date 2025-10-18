# HR Контур

Система управления персоналом с функционалом управления вакансиями, кандидатами и стажировками для ОЭЗ "Технополис Москва". Включает в себя канбан-доску для отслеживания процесса найма.

## Возможности

### Основной функционал
- **Управление вакансиями**: создание, редактирование, модерация вакансий
- **Система кандидатов**: отслеживание откликов и управление кандидатами
- **Канбан-доска**: визуальное управление процессом найма с drag-and-drop
- **Стажировки**: управление запросами на стажировки от университетов
- **Аутентификация**: система ролей (Admin, HR, University)


## Структура проекта

```
mosprom-hr-MISIS-Pakosti/
├── backend/                 # FastAPI backend
│   ├── auth/               # Аутентификация и авторизация
│   │   ├── models.py       # Модели пользователей
│   │   ├── router.py       # API endpoints для auth
│   │   ├── schemas.py      # Pydantic схемы
│   │   └── auth.py         # JWT токены и хеширование
│   ├── vacancies/          # Управление вакансиями
│   │   ├── models.py       # Модели вакансий и откликов
│   │   ├── router.py       # API endpoints для вакансий
│   │   └── schemas.py      # Pydantic схемы
│   ├── internship/         # Управление стажировками
│   │   ├── models.py       # Модели стажировок
│   │   ├── router.py       # API endpoints
│   │   └── schemas.py      # Pydantic схемы
│   ├── main.py             # Точка входа FastAPI
│   ├── database.py         # Конфигурация базы данных
│   ├── requirements.txt    # Python зависимости
│   └── Dockerfile          # Docker образ для backend
├── frontend/               # Next.js frontend
│   ├── app/               # App Router (Next.js 13+)
│   │   ├── board/         # Канбан-доска
│   │   ├── candidates/     # Управление кандидатами
│   │   ├── vacancies/      # Управление вакансиями
│   │   ├── internships/    # Управление стажировками
│   │   ├── login/         # Страница входа
│   │   ├── register/      # Страница регистрации
│   │   └── layout.tsx     # Основной layout
│   ├── components/        # Переиспользуемые компоненты
│   │   ├── AppShell/      # Навигация и оболочка
│   │   └── ProtectedRoute.tsx # Защищенные маршруты
│   ├── contexts/          # React контексты
│   │   └── AuthContext.tsx # Контекст аутентификации
│   ├── lib/              # Утилиты и API клиент
│   │   └── api.ts        # HTTP клиент для backend
│   ├── types/            # TypeScript типы
│   │   ├── index.ts      # Основные типы
│   │   └── board.ts      # Типы для канбан-доски
│   ├── package.json      # Node.js зависимости
│   └── Dockerfile        # Docker образ для frontend
├── docker-compose.yml    # Docker Compose конфигурация
├── .gitignore           # Git ignore правила
└── README.md           # Этот файл
```

## Технологический стек

### Backend
- **FastAPI** - веб-фреймворк Python
- **Tortoise ORM** 
- **SQLite** 
- **Pydantic** 

### Frontend
- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - типизированный JavaScript
- **React Context** - управление состоянием


## Быстрый старт

### Предварительные требования
- Docker и Docker Compose
- Git

### Запуск через Docker (рекомендуется)

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/your-username/mosprom-hr-MISIS-Pakosti.git
   cd mosprom-hr-MISIS-Pakosti
   ```

2. **Запустите приложение**
   ```bash
   docker-compose up --build
   ```

3. **Откройте в браузере**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API документация: http://localhost:8000/docs


