#!/bin/bash

# 🧪 Bash Script для быстрого тестирования API
# Этот скрипт проверяет основные роуты вашего приложения

echo "🚀 Начинаю тестирование API роутов..."
echo "🔗 Убедитесь что приложение запущено на http://localhost:8080"
echo ""

BASE_URL="http://localhost:8080"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Function to check if jq is available
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}⚠️  jq не установлен. Вывод JSON не будет форматирован.${NC}"
        JQ_AVAILABLE=false
    else
        JQ_AVAILABLE=true
    fi
}

# Function to format JSON output
format_json() {
    if [ "$JQ_AVAILABLE" = true ]; then
        echo "$1" | jq .
    else
        echo "$1"
    fi
}

check_jq

# 1. Health Check
echo -e "${CYAN}1. 🏥 Проверка Health Check...${NC}"
HEALTH_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$BASE_URL/api/public/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health Check: OK${NC}"
    if [ "$JQ_AVAILABLE" = true ]; then
        APP_NAME=$(echo "$HEALTH_BODY" | jq -r '.application // "N/A"')
        VERSION=$(echo "$HEALTH_BODY" | jq -r '.version // "N/A"')
        echo -e "${GRAY}   Application: $APP_NAME${NC}"
        echo -e "${GRAY}   Version: $VERSION${NC}"
    fi
else
    echo -e "${RED}❌ Health Check failed. HTTP Code: $HTTP_CODE${NC}"
    echo -e "${RED}⚠️  Приложение не запущено или недоступно!${NC}"
    exit 1
fi

echo ""

# 2. Тестирование User API
echo -e "${CYAN}2. 👤 Тестирование User API...${NC}"

# Создание пользователя
RANDOM_NUM=$RANDOM
USER_JSON="{
    \"username\": \"test_user_$RANDOM_NUM\",
    \"email\": \"test$RANDOM_NUM@example.com\",
    \"passwordHash\": \"password123\",
    \"role\": \"USER\"
}"

USER_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/users" \
    -H "Content-Type: application/json" \
    -d "$USER_JSON")

USER_HTTP_CODE=$(echo "$USER_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
USER_BODY=$(echo "$USER_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$USER_HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✅ Пользователь создан${NC}"
    if [ "$JQ_AVAILABLE" = true ]; then
        USER_ID=$(echo "$USER_BODY" | jq -r '.id // "N/A"')
        USERNAME=$(echo "$USER_BODY" | jq -r '.username // "N/A"')
        echo -e "${GRAY}   ID: $USER_ID${NC}"
        echo -e "${GRAY}   Username: $USERNAME${NC}"
    fi
else
    echo -e "${RED}❌ Создание пользователя failed. HTTP Code: $USER_HTTP_CODE${NC}"
    USER_ID=""
fi

# Получение всех пользователей
ALL_USERS_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$BASE_URL/api/users")
ALL_USERS_HTTP_CODE=$(echo "$ALL_USERS_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
ALL_USERS_BODY=$(echo "$ALL_USERS_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$ALL_USERS_HTTP_CODE" = "200" ]; then
    if [ "$JQ_AVAILABLE" = true ]; then
        USERS_COUNT=$(echo "$ALL_USERS_BODY" | jq '. | length')
        echo -e "${GREEN}✅ Получено пользователей: $USERS_COUNT${NC}"
    else
        echo -e "${GREEN}✅ Получение пользователей: OK${NC}"
    fi
else
    echo -e "${RED}❌ Получение пользователей failed. HTTP Code: $ALL_USERS_HTTP_CODE${NC}"
fi

echo ""

# 3. Тестирование Workspace API (если пользователь создан)
if [ -n "$USER_ID" ] && [ "$USER_ID" != "N/A" ]; then
    echo -e "${CYAN}3. 🏢 Тестирование Workspace API...${NC}"
    
    WORKSPACE_JSON="{
        \"name\": \"Test Workspace $RANDOM_NUM\",
        \"description\": \"Автоматически созданный workspace для тестирования\",
        \"ownerId\": $USER_ID
    }"
    
    WORKSPACE_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/workspaces" \
        -H "Content-Type: application/json" \
        -d "$WORKSPACE_JSON")
    
    WORKSPACE_HTTP_CODE=$(echo "$WORKSPACE_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
    WORKSPACE_BODY=$(echo "$WORKSPACE_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')
    
    if [ "$WORKSPACE_HTTP_CODE" = "201" ]; then
        echo -e "${GREEN}✅ Workspace создан${NC}"
        if [ "$JQ_AVAILABLE" = true ]; then
            WORKSPACE_ID=$(echo "$WORKSPACE_BODY" | jq -r '.id // "N/A"')
            WORKSPACE_NAME=$(echo "$WORKSPACE_BODY" | jq -r '.name // "N/A"')
            echo -e "${GRAY}   ID: $WORKSPACE_ID${NC}"
            echo -e "${GRAY}   Name: $WORKSPACE_NAME${NC}"
        fi
    else
        echo -e "${RED}❌ Создание workspace failed. HTTP Code: $WORKSPACE_HTTP_CODE${NC}"
        WORKSPACE_ID=""
    fi
    
    echo ""
fi

# 4. Проверка всех основных GET роутов
echo -e "${CYAN}4. 📊 Проверка GET роутов...${NC}"

ROUTES=(
    "/api/users"
    "/api/workspaces" 
    "/api/boards"
    "/api/tasks"
)

for route in "${ROUTES[@]}"; do
    RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$BASE_URL$route")
    HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
    BODY=$(echo "$RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')
    
    if [ "$HTTP_CODE" = "200" ]; then
        if [ "$JQ_AVAILABLE" = true ]; then
            COUNT=$(echo "$BODY" | jq '. | length // 0')
            echo -e "${GREEN}✅ $route - Получено записей: $COUNT${NC}"
        else
            echo -e "${GREEN}✅ $route - OK${NC}"
        fi
    else
        echo -e "${RED}❌ $route - HTTP Code: $HTTP_CODE${NC}"
    fi
done

echo ""

# 5. Итоговый отчет
echo -e "${GREEN}🎯 Тестирование завершено!${NC}"
echo ""
echo -e "${YELLOW}📋 Полезные ссылки:${NC}"
echo -e "${CYAN}   • Swagger UI: $BASE_URL/swagger-ui.html${NC}"
echo -e "${CYAN}   • Health Check: $BASE_URL/api/public/health${NC}"
echo -e "${CYAN}   • API Docs: $BASE_URL/api-docs${NC}"
echo ""
echo -e "${YELLOW}💡 Для детального тестирования откройте Swagger UI в браузере!${NC}"