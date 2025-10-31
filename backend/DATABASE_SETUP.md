# 🗄️ Налаштування бази даних PostgreSQL

## ✅ Схема БД створена!

Prisma схема містить всі необхідні таблиці для Fitness Trainer App:

### Таблиці:
- **users** - користувачі
- **exercises** - база вправ
- **workouts** - тренування
- **workout_exercises** - вправи в тренуванні
- **programs** - програми тренувань
- **program_exercises** - вправи в програмі
- **user_programs** - призначені програми
- **nutrition_logs** - щоденник харчування
- **nutrition_items** - продукти в щоденнику
- **foods** - база продуктів

---

## 📝 Налаштування підключення

### Крок 1: Створіть базу даних

Відкрийте PostgreSQL (pgAdmin або командний рядок) і виконайте:

```sql
CREATE DATABASE fitness_trainer;
```

### Крок 2: Оновіть .env файл

Відкрийте `backend/.env` і налаштуйте `DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/fitness_trainer?schema=public"
```

**Замініть:**
- `username` - ваш PostgreSQL користувач (зазвичай `postgres`)
- `password` - ваш пароль PostgreSQL
- `5432` - порт (за замовчуванням 5432)
- `fitness_trainer` - назва бази даних

**Приклад:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/fitness_trainer?schema=public"
```

### Крок 3: Згенеруйте Prisma Client

```bash
cd backend
npm run prisma:generate
```

### Крок 4: Створіть міграції та таблиці

```bash
npm run prisma:migrate
```

Введіть назву міграції (наприклад: `init`)

### Крок 5: Перевірте підключення

```bash
npm run prisma:studio
```

Відкриється веб-інтерфейс для перегляду БД (http://localhost:5555)

---

## 🔍 Як знайти параметри підключення

### Якщо встановлено через установщик:
1. Відкрийте **pgAdmin**
2. Підключення зазвичай називається **PostgreSQL 15** або **localhost**
3. Користувач: `postgres` (або той який ви створили)
4. Пароль: той який ви встановили під час інсталяції

### Якщо встановлено через Docker:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness_trainer?schema=public"
```

---

## ⚠️ Безпека

**НІКОЛИ не комітьте `.env` файл з паролями!**

Файл `.gitignore` вже містить `.env`, тому він не потрапить в Git.

---

## 🆘 Якщо щось не працює

### Помилка підключення:
1. Перевірте що PostgreSQL запущений (Services → PostgreSQL)
2. Перевірте правильність пароля
3. Перевірте порт (за замовчуванням 5432)

### Створити базу через командний рядок:
```bash
# Знайдіть шлях до psql (зазвичай C:\Program Files\PostgreSQL\15\bin\psql.exe)
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
# Введіть пароль, потім:
CREATE DATABASE fitness_trainer;
\q
```

---

**Після налаштування виконайте міграції і все буде готово!** 🚀

