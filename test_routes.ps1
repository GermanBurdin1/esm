# 🧪 PowerShell Script для быстрого тестирования API
# Этот скрипт проверяет основные роуты вашего приложения

Write-Host "🚀 Начинаю тестирование API роутов..." -ForegroundColor Green
Write-Host "🔗 Убедитесь что приложение запущено на http://localhost:8080" -ForegroundColor Yellow
Write-Host ""

$baseUrl = "http://localhost:8080"

# 1. Health Check
Write-Host "1. 🏥 Проверка Health Check..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/api/public/health" -Method GET
    Write-Host "✅ Health Check: $($healthResponse.status)" -ForegroundColor Green
    Write-Host "   Application: $($healthResponse.application)" -ForegroundColor Gray
    Write-Host "   Version: $($healthResponse.version)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⚠️  Приложение не запущено или недоступно!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Тестирование User API
Write-Host "2. 👤 Тестирование User API..." -ForegroundColor Cyan

# Создание пользователя
$newUser = @{
    username = "test_user_$(Get-Random)"
    email = "test$(Get-Random)@example.com"
    passwordHash = "password123"
    role = "USER"
} | ConvertTo-Json

try {
    $userResponse = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method POST -Body $newUser -ContentType "application/json"
    $userId = $userResponse.id
    Write-Host "✅ Пользователь создан с ID: $userId" -ForegroundColor Green
    Write-Host "   Username: $($userResponse.username)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Создание пользователя failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Получение всех пользователей
try {
    $allUsers = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method GET
    Write-Host "✅ Получено пользователей: $($allUsers.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Получение пользователей failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. Тестирование Workspace API (если пользователь создан)
if ($userId) {
    Write-Host "3. 🏢 Тестирование Workspace API..." -ForegroundColor Cyan
    
    $newWorkspace = @{
        name = "Test Workspace $(Get-Random)"
        description = "Автоматически созданный workspace для тестирования"
        ownerId = $userId
    } | ConvertTo-Json
    
    try {
        $workspaceResponse = Invoke-RestMethod -Uri "$baseUrl/api/workspaces" -Method POST -Body $newWorkspace -ContentType "application/json"
        $workspaceId = $workspaceResponse.id
        Write-Host "✅ Workspace создан с ID: $workspaceId" -ForegroundColor Green
        Write-Host "   Name: $($workspaceResponse.name)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Создание workspace failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# 4. Тестирование Board API (если workspace создан)
if ($workspaceId) {
    Write-Host "4. 📋 Тестирование Board API..." -ForegroundColor Cyan
    
    $newBoard = @{
        name = "Test Board $(Get-Random)"
        description = "Автоматически созданная доска для тестирования"
        workspaceId = $workspaceId
    } | ConvertTo-Json
    
    try {
        $boardResponse = Invoke-RestMethod -Uri "$baseUrl/api/boards" -Method POST -Body $newBoard -ContentType "application/json"
        $boardId = $boardResponse.id
        Write-Host "✅ Board создана с ID: $boardId" -ForegroundColor Green
        Write-Host "   Name: $($boardResponse.name)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Создание board failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# 5. Проверка всех основных GET роутов
Write-Host "5. 📊 Проверка GET роутов..." -ForegroundColor Cyan

$getRoutes = @(
    "/api/users",
    "/api/workspaces", 
    "/api/boards",
    "/api/tasks",
    "/api/comments",
    "/api/labels"
)

foreach ($route in $getRoutes) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$route" -Method GET
        $count = if ($response -is [array]) { $response.Count } else { 1 }
        Write-Host "✅ $route - Получено записей: $count" -ForegroundColor Green
    } catch {
        Write-Host "❌ $route - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# 6. Итоговый отчет
Write-Host "🎯 Тестирование завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Полезные ссылки:" -ForegroundColor Yellow
Write-Host "   • Swagger UI: $baseUrl/swagger-ui.html" -ForegroundColor Cyan
Write-Host "   • Health Check: $baseUrl/api/public/health" -ForegroundColor Cyan
Write-Host "   • API Docs: $baseUrl/api-docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Для детального тестирования откройте Swagger UI в браузере!" -ForegroundColor Yellow