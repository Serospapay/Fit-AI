# 🚀 Швидкий старт проекту

## 1️⃣ Налаштування PostgreSQL

### Варіант 1: Локальне встановлення
1. Відкрийте pgAdmin або psql
2. Створіть базу даних:
```sql
CREATE DATABASE fitness_trainer;
```

### Варіант 2: Docker
```bash
docker run --name fitness-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fitness_trainer -p 5432:5432 -d postgres:15
```

## 2️⃣ Налаштування backend

```bash
cd backend
```

### Налаштуйте `.env` файл:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness_trainer?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Виконайте міграції:
```bash
npm run prisma:migrate
# Введіть назву: init
```

### Запустіть сервер:
```bash
npm run dev
```

Сервер буде доступний на http://localhost:5000

## 3️⃣ Налаштування frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend буде доступний на http://localhost:3000

## 4️⃣ Перевірка

### Backend:
- Health check: http://localhost:5000/api/health
- API docs: http://localhost:5000/api/auth

### Frontend:
- Відкрийте: http://localhost:3000

## 📊 Prisma Studio

Для перегляду бази даних:
```bash
cd backend
npm run prisma:studio
```

Відкриється http://localhost:5555

## 🧪 Тестування API

### Реєстрація:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

### Вхід:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

