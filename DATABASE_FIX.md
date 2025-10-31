# 🔧 Виправлення проблеми з PostgreSQL

## Проблема
```
Error: P1000: Authentication failed against database server
```

## 🔍 Рішення

### Крок 1: Знайдіть ваш пароль PostgreSQL

**Варіант А: pgAdmin**
1. Відкрийте pgAdmin
2. Підключіться до сервера PostgreSQL  
3. Пароль встановлювався під час інсталяції

**Варіант Б: Спробуйте стандартний пароль**
Стандартний пароль часто: `postgres`

**Варіант В: Перегляньте збережені паролі**
- pgAdmin зберігає паролі в pgpass файлі
- Шукайте у C:\Users\[username]\AppData\Roaming\postgresql\

### Крок 2: Оновіть .env файл

Відкрийте `backend/.env` та змініть:

```env
DATABASE_URL="postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/fitness_trainer?schema=public"
```

**Замініть `ВАШ_ПАРОЛЬ`** на правильний пароль.

### Крок 3: Виконайте міграції знову

```bash
cd backend
npm run prisma:migrate
```

---

## 🐳 Альтернатива: Docker

Якщо не можете знайти пароль, краще використати Docker:

### Встановіть Docker Desktop:
https://www.docker.com/products/docker-desktop/

### Після встановлення:

```bash
docker-compose up -d
```

Це запустить PostgreSQL з паролем `postgres`.

**Також оновіть .env:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness_trainer?schema=public"
```

---

## ✅ Перевірка

```bash
cd backend
npm run prisma:studio
```

Якщо Prisma Studio відкрився - все працює! 🎉

