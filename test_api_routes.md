# 🧪 Тестирование API роутов - Пошаговое руководство

## Предварительные условия
1. Запустите приложение: `mvn spring-boot:run` или из IDE
2. Убедитесь что PostgreSQL работает и база данных создана
3. Приложение должно быть доступно на порту 8080

---

## 🏥 1. Проверка Health Check
```bash
curl -X GET http://localhost:8080/api/public/health
```

**Ожидаемый ответ:**
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:30:00",
  "application": "Enterprise Management System (EMS)",
  "version": "1.0.0"
}
```

---

## 👤 2. Тестирование User API

### Создать пользователя
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "passwordHash": "password123",
    "role": "USER"
  }'
```

### Получить всех пользователей
```bash
curl -X GET http://localhost:8080/api/users
```

### Получить пользователя по ID
```bash
curl -X GET http://localhost:8080/api/users/1
```

### Проверить учетные данные
```bash
curl -X POST http://localhost:8080/api/users/validate \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }'
```

---

## 🏢 3. Тестирование Workspace API

### Создать workspace
```bash
curl -X POST http://localhost:8080/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workspace",
    "description": "Workspace для тестирования",
    "ownerId": 1
  }'
```

### Получить все workspace-ы
```bash
curl -X GET http://localhost:8080/api/workspaces
```

---

## 📋 4. Тестирование Board API

### Создать доску
```bash
curl -X POST http://localhost:8080/api/boards \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Board",
    "description": "Доска для тестирования",
    "workspaceId": 1
  }'
```

### Получить доски workspace-а
```bash
curl -X GET http://localhost:8080/api/boards/workspace/1
```

---

## ✅ 5. Тестирование Task API

### Создать задачу
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Тестовая задача",
    "columnId": 1,
    "assigneeId": 1,
    "priority": "HIGH",
    "dueDate": "2024-12-31T23:59:59"
  }'
```

### Получить все задачи
```bash
curl -X GET http://localhost:8080/api/tasks
```

### Переместить задачу (Drag & Drop)
```bash
curl -X PUT http://localhost:8080/api/tasks/1/move \
  -H "Content-Type: application/json" \
  -d '{
    "columnId": 2,
    "position": 1
  }'
```

### Поиск задач
```bash
curl -X GET "http://localhost:8080/api/tasks/search?q=Test"
```

---

## 💬 6. Тестирование Comment API

### Создать комментарий
```bash
curl -X POST http://localhost:8080/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": 1,
    "authorId": 1,
    "text": "Это тестовый комментарий"
  }'
```

### Получить комментарии задачи
```bash
curl -X GET http://localhost:8080/api/comments/task/1
```

---

## 🏷️ 7. Тестирование Label API

### Создать метку
```bash
curl -X POST http://localhost:8080/api/labels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "urgent",
    "color": "#FF5733",
    "boardId": 1
  }'
```

### Получить метки доски
```bash
curl -X GET http://localhost:8080/api/labels/board/1
```

### Добавить метку к задаче
```bash
curl -X POST http://localhost:8080/api/labels/task/1/label/1
```

---

## 🔧 8. Тестирование через PowerShell (Windows)

Если вы используете PowerShell, используйте `Invoke-RestMethod`:

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:8080/api/public/health" -Method GET

# Создать пользователя
$userBody = @{
    username = "testuser"
    email = "test@example.com" 
    passwordHash = "password123"
    role = "USER"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/users" -Method POST -Body $userBody -ContentType "application/json"
```

---

## 📊 9. Коды ответов для проверки

- ✅ `200 OK` - Успешное выполнение
- ✅ `201 Created` - Ресурс создан  
- ✅ `204 No Content` - Ресурс удалён
- ❌ `400 Bad Request` - Неверные данные
- ❌ `404 Not Found` - Ресурс не найден
- ❌ `500 Internal Server Error` - Ошибка сервера

---

## 🎯 10. Автоматизированное тестирование

Для более продвинутого тестирования можно использовать:

### Postman Collection
Импортируйте Swagger JSON в Postman:
```
http://localhost:8080/v3/api-docs
```

### Тестирование с помощью Maven/Gradle
Создайте интеграционные тесты для контроллеров.

---

## 🚀 Быстрый старт

1. **Запустите приложение**
2. **Откройте Swagger UI**: http://localhost:8080/swagger-ui.html  
3. **Проверьте Health**: http://localhost:8080/api/public/health
4. **Создайте тестовые данные** в следующем порядке:
   - User → Workspace → Board → Task → Comment → Label

---

Удачного тестирования! 🎉