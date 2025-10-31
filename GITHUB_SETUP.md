# 🔗 Налаштування GitHub репозиторію

## ✅ Що вже налаштовано:

- ✅ Git username: `Serospapay`
- ✅ Email: `Serospapay@users.noreply.github.com`
- ✅ Remote репозиторій: `https://github.com/Serospapay/Fit-AI.git`
- ✅ Гілка перейменована на `main`

---

## 📤 Як завантажити код на GitHub:

### Варіант 1: Якщо репозиторій УЖЕ створений на GitHub

Просто виконайте:
```powershell
git push -u origin main
```

### Варіант 2: Якщо репозиторій ще НЕ створений на GitHub

1. Зайдіть на https://github.com
2. Натисніть "+" (праворуч вгорі) → "New repository"
3. **Назва репозиторію:** `Fit-AI`
4. **Опис (опціонально):** "Fitness Trainer App with AI recommendations"
5. Оберіть **Public** або **Private**
6. ⚠️ **НЕ** ставте галочки:
   - ❌ "Add a README file"
   - ❌ "Add .gitignore"
   - ❌ "Choose a license"
7. Натисніть "Create repository"

8. Після створення виконайте:
```powershell
git push -u origin main
```

---

## 🔐 Аутентифікація на GitHub

При першому `git push` GitHub може запитати аутентифікацію. Є 2 варіанти:

### Варіант А: Personal Access Token (Рекомендовано)

1. Зайдіть на GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Натисніть "Generate new token (classic)"
3. Дайте назву (наприклад: "Fit-AI Development")
4. Оберіть права: `repo` (повні права до репозиторіїв)
5. Натисніть "Generate token"
6. **СКОПІЮЙТЕ ТОКЕН** (його більше не буде видно!)

7. При `git push` введіть:
   - Username: `Serospapay`
   - Password: **вставте токен** (не ваш пароль!)

### Варіант Б: GitHub Desktop (Простіше)

Завантажте GitHub Desktop з https://desktop.github.com/
Це графічний інтерфейс для роботи з Git/GitHub - простіше для початківців.

---

## 🚀 Після успішного push:

Ваш код буде доступний за адресою:
**https://github.com/Serospapay/Fit-AI**

---

## 📝 Як працювати далі:

### Щоразу коли робите зміни:

```powershell
# 1. Додати зміни
git add .

# 2. Зберегти локально
git commit -m "Опис змін"

# 3. Відправити на GitHub
git push
```

### Оновити код з GitHub (якщо працюєте на кількох комп'ютерах):

```powershell
git pull
```

---

## 🆘 Якщо щось пішло не так:

### Відмінити останній push (якщо щось не так):
```powershell
git reset --soft HEAD~1
```

### Перевірити статус:
```powershell
git status
git remote -v
```

---

**Готові завантажити код? Виконайте `git push -u origin main` після того як створите репозиторій на GitHub!** 🚀

