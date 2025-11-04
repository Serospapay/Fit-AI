# Документація для розробників

**Останнє оновлення**: 2024-11-04

---

## 📋 Зміст

1. [Вступ](#вступ)
2. [Архітектура проекту](#архітектура-проекту)
3. [Налаштування середовища розробки](#налаштування-середовища-розробки)
4. [Структура проекту](#структура-проекту)
5. [API документація](#api-документація)
6. [Робота з базою даних](#робота-з-базою-даних)
7. [Стандарти коду](#стандарти-коду)
8. [Тестування](#тестування)
9. [Розгортання](#розгортання)
10. [Часті проблеми та рішення](#часті-проблеми-та-рішення)

---

## Вступ

Цей документ призначений для розробників, які працюють над проектом "Кишеньковий тренер". Він містить інформацію про архітектуру, стандарти кодування та інструкції для роботи з проектом.

**Технологічний стек**:
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: Next.js 14, React, TypeScript, Bootstrap
- **База даних**: PostgreSQL
- **Документація API**: Swagger/OpenAPI

---

## Архітектура проекту

### Загальна структура

```
├── backend/          # Backend API (Express + TypeScript)
├── frontend/         # Frontend (Next.js + React)
├── docs/             # Документація проекту
└── PLAN.md          # План розробки
```

### Backend архітектура

```
backend/
├── src/
│   ├── controllers/    # Контролери для обробки запитів
│   ├── routes/         # Маршрути API
│   ├── middleware/     # Middleware (auth, error handling)
│   ├── lib/            # Утиліти та конфігурація
│   ├── types/          # TypeScript типи
│   └── utils/          # Допоміжні функції
├── prisma/            # Prisma схема та міграції
└── package.json
```

### Frontend архітектура

```
frontend/
├── app/               # Next.js App Router
│   ├── (pages)/       # Сторінки додатку
│   ├── components/     # React компоненти
│   └── lib/           # Утиліти та API клієнт
└── public/            # Статичні файли
```

---

## Налаштування середовища розробки

### Вимоги

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm або yarn

### Крок 1: Клонування репозиторію

```bash
git clone <repository-url>
cd <project-directory>
```

### Крок 2: Налаштування Backend

```bash
cd backend

# Встановлення залежностей
npm install

# Налаштування змінних середовища
cp .env.example .env
# Відредагуйте .env файл з вашими налаштуваннями

# Налаштування бази даних
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Запуск у режимі розробки
npm run dev
```

**Змінні середовища Backend** (`.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fitness_db"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

### Крок 3: Налаштування Frontend

```bash
cd frontend

# Встановлення залежностей
npm install

# Налаштування змінних середовища
cp .env.example .env.local
# Відредагуйте .env.local файл

# Запуск у режимі розробки
npm run dev
```

**Змінні середовища Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Структура проекту

### Backend модулі

#### Controllers (`backend/src/controllers/`)

Контролери обробляють HTTP запити та повертають відповіді.

**Приклад структури контролера**:
```typescript
import { AuthRequest, Response } from 'express';
import { AuthRequest } from '../types';

export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    // Логіка обробки
    res.status(201).json(result);
  } catch (error: unknown) {
    logger.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

#### Routes (`backend/src/routes/`)

Маршрути визначають URL endpoints та підключають контролери.

**Приклад**:
```typescript
import { Router } from 'express';
import { createWorkout, getWorkouts } from '../controllers/workout.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createWorkout);
router.get('/', authenticateToken, getWorkouts);

export default router;
```

#### Middleware (`backend/src/middleware/`)

- `auth.ts` - Аутентифікація користувачів
- `errorHandler.ts` - Централізована обробка помилок

### Frontend модулі

#### Pages (`frontend/app/`)

Сторінки використовують Next.js App Router.

**Приклад**:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  
  useEffect(() => {
    fetchWorkouts();
  }, []);
  
  // ...
}
```

#### Components (`frontend/app/components/`)

Переважно використовуються для повторного використання UI компонентів.

#### API Client (`frontend/app/lib/api.ts`)

Централізований клієнт для API запитів з типізацією.

---

## API документація

### Доступ до документації

Swagger UI доступний за адресою: `http://localhost:5000/api-docs`

### Основні endpoints

#### Auth
- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Вхід
- `GET /api/auth/profile` - Отримати профіль
- `PUT /api/auth/profile` - Оновити профіль

#### Workouts
- `GET /api/workouts` - Список тренувань
- `POST /api/workouts` - Створити тренування
- `GET /api/workouts/stats` - Статистика

#### Nutrition
- `GET /api/nutrition` - Список записів харчування
- `POST /api/nutrition` - Створити запис
- `GET /api/nutrition/stats` - Статистика

Детальну документацію дивіться у Swagger UI.

---

## Робота з базою даних

### Prisma

Проект використовує Prisma ORM для роботи з базою даних.

### Основні команди

```bash
# Генерація Prisma Client
npx prisma generate

# Створення міграції
npx prisma migrate dev --name migration_name

# Застосування міграцій
npx prisma migrate deploy

# Відкрити Prisma Studio (GUI для БД)
npx prisma studio

# Seed бази даних
npx prisma db seed
```

### Приклад використання Prisma

```typescript
import { prisma } from '../lib/prisma';

// Створення запису
const workout = await prisma.workout.create({
  data: {
    userId: 'user-id',
    date: new Date(),
    type: 'strength',
    // ...
  }
});

// Читання з фільтрами
const workouts = await prisma.workout.findMany({
  where: {
    userId: 'user-id',
    date: {
      gte: new Date('2024-01-01')
    }
  },
  include: {
    exercises: true
  }
});
```

---

## Стандарти коду

### TypeScript

- ✅ Використовуйте конкретні типи замість `any`
- ✅ Використовуйте `unknown` для обробки помилок
- ✅ Додавайте JSDoc коментарі для публічних функцій
- ✅ Використовуйте централізовані типи з `backend/src/types/`

### Обробка помилок

**Правильний спосіб**:
```typescript
try {
  // код
} catch (error: unknown) {
  logger.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

**Неправильний спосіб**:
```typescript
try {
  // код
} catch (error: any) {
  console.error(error);
}
```

### Найменування

- **Файли**: camelCase для утиліт, kebab-case для компонентів
- **Змінні**: camelCase
- **Константи**: UPPER_SNAKE_CASE
- **Компоненти**: PascalCase

### Форматування

Проект використовує ESLint та Prettier. Переконайтеся, що ваш код відформатований:

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

---

## Тестування

### Backend тести

```bash
cd backend
npm test
```

### Frontend тести

```bash
cd frontend
npm test
```

---

## Розгортання

### Production build

**Backend**:
```bash
cd backend
npm run build
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

### Змінні середовища для Production

Обов'язково налаштуйте:
- `DATABASE_URL` - Production база даних
- `JWT_SECRET` - Безпечний секретний ключ
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL` - Production API URL

---

## Часті проблеми та рішення

### Проблема: Prisma Client не генерується

**Рішення**:
```bash
cd backend
npx prisma generate
```

### Проблема: Міграції не застосовуються

**Рішення**:
```bash
cd backend
npx prisma migrate reset  # Увага: видалить дані!
npx prisma migrate dev
```

### Проблема: CORS помилки

**Рішення**: Перевірте налаштування CORS у `backend/src/index.ts` та `NEXT_PUBLIC_API_URL` у frontend.

### Проблема: TypeScript помилки

**Рішення**:
```bash
# Backend
cd backend && npx tsc --noEmit

# Frontend
cd frontend && npx tsc --noEmit
```

---

## Корисні посилання

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Контакти та підтримка

Для питань та проблем:
1. Перевірте документацію
2. Перевірте issues на GitHub
3. Створіть новий issue з детальним описом проблеми

---

**Останнє оновлення**: 2024-11-04


