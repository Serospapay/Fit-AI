# 🔄 Синхронізація Frontend та Backend

## ✅ Що вже реалізовано

### Backend (Node.js + Express + Prisma + PostgreSQL)
- ✅ API для автентифікації (register/login)
- ✅ API для вправ (CRUD + фільтрація)
- ✅ API для тренувань (CRUD + статистика)
- ✅ JWT автентифікація
- ✅ Seed дані (20+ вправ)

### Frontend (Next.js 16 + React 19 + Bootstrap 5)
- ✅ Сучасний landing page
- ✅ Сторінка реєстрації/логіну
- ✅ Dashboard з статистикою
- ✅ База вправ з фільтрами
- ✅ Форма створення тренування
- ✅ Список тренувань
- ✅ Калькулятори (ІМТ, BMR, TDEE)

## 🚀 Як запустити проект

### Варіант 1: Автоматичний запуск (Windows)

1. **Запустити start.bat:**
   ```bash
   start.bat
   ```
   
   Або в PowerShell:
   ```powershell
   .\start.ps1
   ```

### Варіант 2: Ручний запуск

#### Крок 1: Запустити Backend

```bash
cd backend
npm install
npm run dev
```

**Примітка:** Якщо база даних не підключена, потрібно:

1. Запустити PostgreSQL (локально або через Docker)
2. Створити `.env` файл в `backend/`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness_trainer?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   PORT=5000
   CORS_ORIGIN="http://localhost:3000"
   ```
3. Запустити міграції:
   ```bash
   cd backend
   npm run prisma:migrate
   ```
4. Запустити seed дані:
   ```bash
   npm run prisma:seed
   ```

#### Крок 2: Запустити Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📁 Структура проекту

```
DPFah/2/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── controllers/        # API контролери
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth middleware
│   │   └── index.ts            # Entry point
│   ├── prisma/
│   │   ├── schema.prisma       # База даних схема
│   │   └── seed.ts             # Seed дані
│   └── package.json
│
├── frontend/                   # Frontend app
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Логін
│   │   ├── register/           # Реєстрація
│   │   ├── dashboard/          # Dashboard
│   │   ├── exercises/          # База вправ
│   │   ├── workouts/           # Тренування
│   │   └── calculators/        # Калькулятори
│   ├── components/
│   │   └── BootstrapClient.tsx # Bootstrap JS
│   └── package.json
│
└── docker-compose.yml          # Docker для PostgreSQL
```

## 🔗 API Endpoints

### Автентифікація
- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Вхід
- `GET /api/auth/profile` - Профіль (потрібен токен)

### Вправи
- `GET /api/exercises` - Отримати всі вправи
- `GET /api/exercises/:id` - Отримати вправу по ID
- `GET /api/exercises/options` - Отримати опції для фільтрів

### Тренування
- `GET /api/workouts` - Отримати тренування користувача
- `POST /api/workouts` - Створити тренування
- `GET /api/workouts/:id` - Отримати тренування по ID
- `PUT /api/workouts/:id` - Оновити тренування
- `DELETE /api/workouts/:id` - Видалити тренування
- `GET /api/workouts/stats` - Статистика тренувань

**Всі тренування вимагають автентифікації (Bearer token)**

## 🎨 Frontend сторінки

1. **Landing Page** (`/`) - Головна сторінка з описом
2. **Register** (`/register`) - Реєстрація нових користувачів
3. **Login** (`/login`) - Вхід користувачів
4. **Dashboard** (`/dashboard`) - Основний дашборд після входу
5. **Exercises** (`/exercises`) - База вправ з фільтрами
6. **Workouts** (`/workouts`) - Список тренувань
7. **New Workout** (`/workouts/new`) - Форма створення тренування
8. **Calculators** (`/calculators`) - Калькулятори показників

## 🔒 Автентифікація

Усі запити до API тренувань вимагають JWT токен:
```
Authorization: Bearer <your_jwt_token>
```

Токен зберігається в `localStorage` після успішного login/register.

## 🐛 Troubleshooting

### Backend не запускається

1. Перевір чи PostgreSQL працює
2. Перевір `.env` файл
3. Запусти міграції:
   ```bash
   cd backend
   npm run prisma:migrate
   ```

### Frontend не підключається до Backend

1. Перевір чи Backend запущений на `http://localhost:5000`
2. Перевір CORS налаштування в `backend/src/index.ts`
3. Перевір консоль браузера на помилки

### База даних порожня

Запусти seed дані:
```bash
cd backend
npm run prisma:seed
```

## 📝 Далі можна додати

- [ ] Програми тренувань
- [ ] Щоденник харчування
- [ ] Детальна статистика з графіками
- [ ] AI рекомендації
- [ ] Профіль користувача
- [ ] PWA функціонал

## 🎯 Тестування

### Тестовий користувач

1. Зареєструйтесь на `/register`
2. Або створіть через Prisma Studio:
   ```bash
   cd backend
   npm run prisma:studio
   ```

### Тестові дані

Seed файл містить 20+ вправ для тестування фільтрації та пошуку.

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевір логи Backend в консолі
2. Перевір консоль браузера (F12)
3. Перевір Network вкладку для API запитів

---

**Проект готовий до використання! 🎉**

