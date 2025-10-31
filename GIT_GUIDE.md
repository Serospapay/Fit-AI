# 📚 Посібник з Git для початківців

## 🔧 Крок 1: Встановлення Git

1. Завантажте Git з офіційного сайту: **https://git-scm.com/download/win**
2. Запустіть установщик
3. Під час встановлення:
   - Оберіть **"Git from the command line and also from 3rd-party software"** (за замовчуванням)
   - Оберіть **"Use bundled OpenSSH"**
   - Оберіть **"Checkout Windows-style, commit Unix-style line endings"**
   - Оберіть **"Use MinTTY"**
   - Решту залиште за замовчуванням
4. Після встановлення **перезапустіть термінал/PowerShell**

---

## ✅ Крок 2: Перевірка встановлення

Після перезапуску терміналу виконайте:
```powershell
git --version
```
Має показати версію Git (наприклад: `git version 2.43.0`)

---

## ⚙️ Крок 3: Налаштування Git (перший раз)

Після встановлення потрібно налаштувати своє ім'я та email:

```powershell
git config --global user.name "Ваше Ім'я"
git config --global user.email "ваш.email@example.com"
```

**Приклад:**
```powershell
git config --global user.name "Ivan Petrenko"
git config --global user.email "ivan@example.com"
```

---

## 📁 Крок 4: Ініціалізація репозиторію (я зроблю це автоматично)

Після встановлення та налаштування Git, я:
1. Ініціалізую Git репозиторій у вашому проекті
2. Зроблю перший commit з усіма файлами
3. Покажу основні команди

---

## 🎯 Основні команди Git (щоб розуміти що відбувається)

### Перевірити статус
```powershell
git status
```
Показує які файли змінено, додано, видалено

### Додати файли до staging
```powershell
git add .                    # Додати всі змінені файли
git add файл.txt            # Додати конкретний файл
```

### Зробити commit (зберегти версію)
```powershell
git commit -m "Опис змін"
```

### Переглянути історію
```powershell
git log                      # Вся історія
git log --oneline           # Коротка історія
```

### Створити нову гілку (branch)
```powershell
git branch назва-гілки       # Створити гілку
git checkout назва-гілки     # Перейти на гілку
```

### Показати різницю
```powershell
git diff                     # Показати що змінено
```

---

## 📤 Робота з GitHub (опціонально)

Якщо хочете зберегти код на GitHub:

1. Створіть аккаунт на https://github.com
2. Створіть новий репозиторій (New Repository)
3. Підключіть локальний репозиторій:
```powershell
git remote add origin https://github.com/ваш-username/назва-репозиторію.git
git push -u origin main
```

---

## 🔒 Безпека

⚠️ **ВАЖЛИВО:** Файл `.gitignore` вже створено! Він автоматично приховує:
- `.env` файли (з паролями)
- `node_modules/` (залежності)
- Інші конфіденційні дані

**НІКОЛИ не комітьте `.env` файли з паролями!**

---

## 🆘 Якщо щось пішло не так

### Відмінити останній commit (але залишити зміни)
```powershell
git reset --soft HEAD~1
```

### Відмінити всі локальні зміни
```powershell
git reset --hard HEAD
```

### Подивитися що було змінено
```powershell
git diff
```

---

**Після встановлення Git напишіть мені, і я налаштую все автоматично!** 🚀

