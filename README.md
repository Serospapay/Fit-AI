# 💪 Кишеньковий тренер (Fitness Trainer App)

Мобільний веб-додаток для комплексного підходу до фітнесу, харчування та здорового способу життя з інтелектуальним підбором вправ та програм тренувань.

## 🛠 Технологічний стек

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript + Prisma
- **ML Service:** Python + FastAPI + Scikit-learn
- **Database:** PostgreSQL

## 📁 Структура проекту

```
.
├── frontend/          # Next.js додаток
├── backend/           # Express API
├── ml-service/        # Python ML мікросервіс
└── database/          # Міграції та seed дані
```

## 🚀 Швидкий старт

### Встановлення

1. **Frontend:**
```bash
cd frontend
npm install
npm run dev
```

2. **Backend:**
```bash
cd backend
npm install
# Налаштуйте .env файл (DATABASE_URL)
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

3. **ML Service:**
```bash
cd ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🔧 Налаштування БД

1. Створіть базу даних PostgreSQL: `CREATE DATABASE fitness_trainer;`
2. Оновіть `backend/.env`: встановіть правильний `DATABASE_URL`
3. Виконайте міграції: `npm run prisma:migrate`
4. Перевірте: `npm run prisma:studio`

## 📖 Документація

- [PLAN.md](./PLAN.md) - Детальний план розробки

## 📝 Статус

**В розробці** - Етап 1 завершено: налаштування проекту, схема БД готова

**Rепозиторій:** https://github.com/Serospapay/Fit-AI

