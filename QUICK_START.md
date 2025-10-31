# 🚀 Швидкий старт

## Передумови

- ✅ Node.js 18+ встановлено
- ✅ PostgreSQL локально або Docker
- ✅ npm встановлено

## Крок 1: Клонувати репозиторій

```bash
git clone https://github.com/Serospapay/Fit-AI.git
cd Fit-AI/2
```

## Крок 2: Налаштувати Backend

```bash
cd backend
npm install
```

### Створити .env файл:

Створіть файл `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness_trainer?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
CORS_ORIGIN="http://localhost:3000"
```

### Запустити PostgreSQL

**Варіант А: Docker**
```bash
docker-compose up -d
```

**Варіант Б: Локальний PostgreSQL**
- Встановіть PostgreSQL
- Створіть базу `fitness_trainer`
- Оновіть `DATABASE_URL` в `.env`

### Запустити міграції та seed

```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

## Крок 3: Запустити Backend

```bash
cd backend
npm run dev
```

Backend запуститься на http://localhost:5000

## Крок 4: Запустити Frontend

В новому терміналі:

```bash
cd frontend
npm install
npm run dev
```

Frontend запуститься на http://localhost:3000

## Або використати start.bat/start.ps1

```bash
# Windows
start.bat

# PowerShell
.\start.ps1
```

## 🎉 Готово!

Відкрийте http://localhost:3000 у браузері

## 📋 Тестові кроки

1. Зареєструйтеся або увійдіть
2. Перейдіть на Dashboard
3. Перегляньте базу вправ
4. Додайте тренування
5. Використайте калькулятори

## ❓ Troubleshooting

### Backend не підключається до БД

Перевірте:
- PostgreSQL запущений
- `.env` файл існує та правильний
- Міграції виконані

### Frontend не бачить Backend

Перевірте:
- Backend запущений на порту 5000
- CORS налаштований правильно
- Консоль браузера на помилки

### База даних порожня

Запустіть seed:
```bash
cd backend
npm run prisma:seed
```

---

**Готово до використання! 💪**

