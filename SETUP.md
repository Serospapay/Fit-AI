# 🛠 Налаштування середовища розробки

## 📥 Що потрібно встановити ВРУЧНУ (завантажити з інтернету)

### 1. **Node.js та npm**
- **Що:** Node.js (включає npm)
- **Версія:** 20.x LTS або новіша
- **Де завантажити:** https://nodejs.org/
- **Як перевірити після встановлення:** 
  ```bash
  node --version
  npm --version
  ```
- ✅ Після встановлення Node.js, npm буде доступний автоматично

### 2. **Python**
- **Що:** Python (для ML сервісу)
- **Версія:** 3.11 або новіша
- **Де завантажити:** https://www.python.org/downloads/
- ⚠️ **ВАЖЛИВО:** При встановленні обов'язково поставте галочку "Add Python to PATH"
- **Як перевірити:**
  ```bash
  python --version
  pip --version
  ```

### 3. **PostgreSQL**
- **Що:** База даних PostgreSQL
- **Версія:** 15 або новіша
- **Де завантажити:** https://www.postgresql.org/download/windows/
- ⚠️ **Запам'ятайте пароль** для користувача postgres (він знадобиться!)
- **Альтернатива (якщо не хочете встановлювати локально):**
  - Можна використати Docker (встановити Docker Desktop)
  - Або хмарну БД (Supabase, Railway - безкоштовні опції)

### 4. **Git**
- **Що:** Система контролю версій Git
- **Де завантажити:** https://git-scm.com/download/win
- **Як перевірити:**
  ```bash
  git --version
  ```

### 5. **Текстовий редактор / IDE** (якщо ще немає)
- **Рекомендація:** Visual Studio Code
- **Де завантажити:** https://code.visualstudio.com/
- **Корисні розширення (будуть потрібні):**
  - ES7+ React/Redux/React-Native snippets
  - ESLint
  - Prettier
  - Python
  - Prisma
  - Tailwind CSS IntelliSense

### 6. **Docker Desktop** (опціонально, але рекомендується)
- **Що:** Контейнеризація для локальної розробки
- **Де завантажити:** https://www.docker.com/products/docker-desktop/
- **Навіщо:** Легше запускати PostgreSQL, Redis локально

---

## 🔧 Що встановлю через термінал (після того, як ви встановите базові інструменти)

### Frontend (Next.js проект):
```bash
# Створення Next.js проекту з TypeScript
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir

# Встановлення додаткових залежностей
npm install zustand @tanstack/react-query recharts framer-motion
```

### Backend (Node.js API):
```bash
# Ініціалізація проекту
npm init -y
npm install express @prisma/client bcrypt jsonwebtoken zod cors dotenv
npm install -D typescript @types/express @types/node @types/bcrypt @types/jsonwebtoken ts-node nodemon
```

### ML Service (Python):
```bash
# Створення віртуального середовища та встановлення залежностей
python -m venv ml-service/venv
ml-service/venv/Scripts/activate  # Windows
pip install fastapi uvicorn scikit-learn pandas numpy sqlalchemy python-jose[cryptography] passlib[bcrypt]
```

### Prisma (ORM):
```bash
# Встановлення Prisma CLI
npm install -D prisma
npx prisma init
```

### Глобальні інструменти (опціонально):
```bash
# TypeScript глобально
npm install -g typescript

# Prisma Studio (GUI для БД)
npm install -g prisma
```

---

## ✅ Покрокова інструкція встановлення

### Крок 1: Встановіть Node.js
1. Завантажте з https://nodejs.org/
2. Запустіть установщик
3. Оберіть "Add to PATH" якщо буде запропоновано
4. Встановіть з налаштуваннями за замовчуванням

### Крок 2: Встановіть Python
1. Завантажте з https://www.python.org/downloads/
2. ⚠️ **ОБОВ'ЯЗКОВО** поставте галочку "Add Python to PATH"
3. Оберіть "Install Now"
4. Після встановлення закрийте та відкрийте термінал знову

### Крок 3: Встановіть PostgreSQL (або використайте Docker)
**Варіант А - Пряме встановлення:**
1. Завантажте з https://www.postgresql.org/download/windows/
2. Запустіть установщик
3. Встановіть з налаштуваннями за замовчуванням
4. **Запам'ятайте пароль** для користувача postgres
5. Порт залиште 5432 (за замовчуванням)

**Варіант Б - Docker (рекомендовано):**
1. Встановіть Docker Desktop
2. Я налаштую docker-compose.yml для автоматичного запуску PostgreSQL

### Крок 4: Встановіть Git (якщо ще немає)
1. Завантажте з https://git-scm.com/download/win
2. Встановіть з налаштуваннями за замовчуванням

### Крок 5: Перевірте встановлення
Відкрийте PowerShell або Command Prompt та виконайте:

```powershell
node --version    # Має показати v20.x.x або вище
npm --version     # Має показати 10.x.x або вище
python --version  # Має показати Python 3.11.x або вище
pip --version     # Має показати pip версію
git --version     # Має показати git версію
```

---

## 🚀 Після встановлення базових інструментів

Коли ви встановите Node.js, Python, PostgreSQL та Git, напишіть мені, і я:

1. ✅ Створю структуру проекту
2. ✅ Встановлю всі npm залежності
3. ✅ Встановлю всі Python пакети
4. ✅ Налаштую Prisma
5. ✅ Налаштую базу даних
6. ✅ Створю конфігураційні файли
7. ✅ Перевірю, що все працює

---

## 📝 Швидка перевірка готовності

Виконайте цю команду в терміналі, щоб перевірити все одночасно:

```powershell
Write-Host "=== Перевірка інструментів ===" -ForegroundColor Cyan
Write-Host "Node.js: " -NoNewline; node --version
Write-Host "npm: " -NoNewline; npm --version
Write-Host "Python: " -NoNewline; python --version
Write-Host "pip: " -NoNewline; pip --version
Write-Host "Git: " -NoNewline; git --version
Write-Host "========================" -ForegroundColor Cyan
```

---

## ⚠️ Можливі проблеми та рішення

### Python не знайдено в PowerShell
- Перевірте, що Python додано до PATH
- Перезапустіть термінал
- Спробуйте `py` замість `python` (Windows Launcher)

### npm команди не працюють
- Перевірте, що Node.js встановлений правильно
- Перезапустіть термінал
- Спробуйте `npm install -g npm@latest` для оновлення npm

### PostgreSQL не підключається
- Перевірте, що сервіс запущений (Services → postgresql-x64)
- Перевірте порт 5432
- Спробуйте підключитися через pgAdmin

---

**Готові? Встановіть базові інструменти і дайте знати! Потім я все налаштую автоматично через термінал.** 🚀

