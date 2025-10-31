# 💪 Кишеньковий тренер

**Освітній проект:** Персональний фітнес-додаток з AI-рекомендаціями

## 🚀 Швидкий старт

### 1. Клонувати репозиторій
```bash
git clone https://github.com/Serospapay/Fit-AI.git
cd Fit-AI/2
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

### 3. Налаштувати базу даних

1. Створити `.env` в `backend/`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness_trainer?schema=public"
   PORT=5000
   CORS_ORIGIN="http://localhost:3000"
   ```

2. Запустити міграції та seed (створює користувача):
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

### 4. Відкрити браузер

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📱 Функціонал

### ✅ Реалізовано

- 🎨 Сучасний landing page з адаптацією
- 🔐 Система автентифікації
- 📊 Dashboard зі статистикою
- 💪 База вправ з фільтрами
- 📝 Щоденник тренувань
- 🧮 Калькулятори (ІМТ, BMR, TDEE)

### 🔜 В розробці

- 🏋️ Програми тренувань
- 🍎 Щоденник харчування
- 🤖 AI-рекомендації
- 📉 Детальна аналітика

## 🛠️ Технології

### Frontend
- Next.js 16, React 19, Bootstrap 5, TypeScript

### Backend
- Node.js, Express, Prisma, PostgreSQL, JWT

### ML Service (майбутнє)
- Python, FastAPI, Scikit-learn

## 📂 Структура

```
DPFah/2/
├── frontend/       # Next.js додаток
├── backend/        # Express API
├── ml-service/     # Python ML (майбутнє)
└── docker-compose.yml
```

## 📖 Детальна інформація

Дивіться `PLAN.md` для повного плану розробки  
Дивіться `STATUS.md` для поточного статусу

---

**Проект готовий до використання! 🎉**
