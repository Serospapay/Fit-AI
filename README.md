# 💪 Кишеньковий тренер

**Освітній проект:** Персональний фітнес-додаток з AI-рекомендаціями

## 📋 Опис проекту

Веб-додаток для комплексного підходу до фітнесу, харчування та здорового способу життя з адаптацією під смартфони. Підтримка відстеження тренувань, аналізу прогресу та персональних рекомендацій завдяки AI-технологіям.

## 🛠️ Технології

### Frontend
- **Next.js 16** - React фреймворк з App Router
- **React 19** - Сучасний UI
- **Bootstrap 5** - Responsive дизайн
- **Bootstrap Icons** - Іконки
- **TypeScript** - Статична типізація

### Backend
- **Node.js** - Runtime
- **Express** - Веб-фреймворк
- **Prisma** - ORM для роботи з БД
- **PostgreSQL** - Реляційна база даних
- **JWT** - Автентифікація

### ML Service (майбутнє)
- **Python** + **FastAPI**
- **Scikit-learn** - ML моделі
- **Pandas** - Аналіз даних

## 🚀 Швидкий старт

### 1. Клонувати репозиторій
```bash
git clone <your-repo-url>
cd DPFah/2
```

### 2. Запустити проект

**Windows:**
```bash
start.bat
```

**PowerShell:**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### 3. Налаштувати базу даних

1. Запустити PostgreSQL (локально або Docker)
2. Створити `.env` в `backend/`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness_trainer?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   CORS_ORIGIN="http://localhost:3000"
   ```
3. Запустити міграції:
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

### 4. Відкрити браузер

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

## 📱 Функціонал

### ✅ Реалізовано

- 🎨 Сучасний landing page з адаптацією
- 🔐 Система автентифікації (register/login)
- 📊 Dashboard зі статистикою
- 💪 База вправ з фільтрами та пошуком
- 📝 Щоденник тренувань (CRUD)
- 🧮 Калькулятори (ІМТ, BMR, TDEE)
- 📈 Відстеження прогресу

### 🔜 В розробці

- 🏋️ Програми тренувань
- 🍎 Щоденник харчування
- 🤖 AI-рекомендації
- 📉 Детальна аналітика з графіками
- 👤 Профіль користувача
- 📱 PWA функціонал

## 📂 Структура

```
DPFah/2/
├── frontend/              # Next.js додаток
│   ├── app/
│   │   ├── page.tsx       # Landing page
│   │   ├── dashboard/     # Dashboard
│   │   ├── exercises/     # База вправ
│   │   ├── workouts/      # Тренування
│   │   ├── calculators/   # Калькулятори
│   │   ├── login/         # Автентифікація
│   │   └── register/
│   ├── components/        # React компоненти
│   ├── lib/               # Утиліти та API
│   └── globals.css        # Глобальні стилі
│
├── backend/               # Express API
│   ├── src/
│   │   ├── controllers/   # API контролери
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── index.ts       # Entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Схема БД
│   │   └── seed.ts        # Seed дані
│   └── .env               # Конфігурація
│
├── ml-service/            # Python ML сервіс (майбутнє)
└── docker-compose.yml     # PostgreSQL контейнер
```

## 🔗 API Documentation

### Автентифікація
```http
POST /api/auth/register    # Реєстрація
POST /api/auth/login       # Вхід
GET  /api/auth/profile     # Профіль (JWT)
```

### Вправи
```http
GET /api/exercises                 # Список вправ
GET /api/exercises/options         # Опції для фільтрів
GET /api/exercises/:id             # Деталі вправи
```

### Тренування
```http
GET    /api/workouts         # Мої тренування (JWT)
POST   /api/workouts         # Створити (JWT)
GET    /api/workouts/stats   # Статистика (JWT)
DELETE /api/workouts/:id     # Видалити (JWT)
```

## 📊 База даних

### Основні таблиці

- **User** - Користувачі
- **Exercise** - Вправи (20+ seed)
- **Workout** - Тренування
- **WorkoutExercise** - Вправи в тренуванні
- **Program** - Програми тренувань (майбутнє)
- **NutritionLog** - Щоденник харчування (майбутнє)
- **Food** - База продуктів (майбутнє)

## 🎨 UI/UX Features

- ✅ **Responsive Design** - Mobile-first підхід
- ✅ **Bootstrap 5** - Сучасний UI фреймворк
- ✅ **Smooth Animations** - CSS анімації
- ✅ **Gradient Design** - Красиві градієнти
- ✅ **Bootstrap Icons** - Іконографія
- ✅ **Clean Interface** - Мінімалістичний дизайн

## 🔒 Безпека

- JWT автентифікація
- Хешування паролів (bcrypt)
- CORS налаштування
- Захищені роути

## 📝 Ліцензія

Освітній проект - безкоштовне використання

## 👥 Автор

Створено для дипломної роботи

---

**Готово до використання! 🎉**

Для детальнішої інформації дивіться `SYNC_README.md`

