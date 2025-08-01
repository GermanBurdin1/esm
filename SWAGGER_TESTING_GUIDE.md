# 🧪 Guide de test des API avec Swagger UI

## 🚀 Démarrage rapide

### 1. Lancer l'application avec le seeder
```bash
# L'application va automatiquement remplir la BDD avec des données de test
mvn spring-boot:run
```

### 2. Ouvrir Swagger UI
```
http://localhost:8080/swagger-ui.html
```

---

## 📊 Données de test créées par le seeder

### 👥 **Utilisateurs** (4 créés)
- **admin** (ADMIN) - `admin@company.com` 
- **john_doe** (USER) - `john@company.com`
- **jane_smith** (USER) - `jane@company.com` 
- **bob_wilson** (USER) - `bob@company.com`

**Mot de passe pour tous:** `password123`

### 🏢 **Workspaces** (3 créés)
1. **Développement** (admin)
2. **Marketing** (john_doe)
3. **Ressources Humaines** (jane_smith)

### 📋 **Boards** (3 créés avec colonnes)
1. **Sprint Planning** → colonnes: To Do, In Progress, Review, Done
2. **Bug Tracking** → colonnes: To Do, In Progress, Review, Done  
3. **Campagnes 2024** → colonnes: To Do, In Progress, Review, Done

### ✅ **Tâches** (11 créées)
- Réparties dans différentes colonnes
- Avec priorités variées (HIGH, MEDIUM, LOW)
- Assignées à différents utilisateurs

### 🏷️ **Labels** (9 créés)
- urgent, bug, feature, enhancement (board dev)
- critical, investigation (board bugs)
- social-media, email, design (board marketing)

### 💬 **Commentaires** (4 créés)
- Sur différentes tâches avec du contenu réaliste

---

## 🔧 Comment tester dans Swagger UI

### **1. User Management** 👤

#### ✅ **GET /api/users** - Obtenir tous les utilisateurs
1. Cliquez sur la section "User Management"
2. Cliquez sur "GET /api/users" 
3. Cliquez "Try it out"
4. Cliquez "Execute"

**Résultat attendu:** Liste de 4 utilisateurs avec leurs infos (sans mots de passe)

#### ✅ **POST /api/users/validate** - Tester l'authentification
1. Cliquez sur "POST /api/users/validate"
2. Cliquez "Try it out"
3. Dans le Request body, mettez:
```json
{
  "usernameOrEmail": "admin",
  "password": "password123"
}
```
4. Cliquez "Execute"

**Résultat attendu:** `{"valid": true}`

#### ✅ **GET /api/users/{id}** - Utilisateur par ID
1. Cliquez sur "GET /api/users/{id}"
2. Cliquez "Try it out"
3. Dans le champ "id", mettez `1`
4. Cliquez "Execute"

**Résultat attendu:** Infos de l'utilisateur admin

---

### **2. Workspace Management** 🏢

#### ✅ **GET /api/workspaces** - Tous les workspaces
1. Cliquez sur "Workspace Management"
2. Cliquez sur "GET /api/workspaces"
3. Cliquez "Try it out" → "Execute"

**Résultat attendu:** 3 workspaces créés

#### ✅ **GET /api/workspaces/owner/{ownerId}** - Workspaces d'un user
1. Cliquez sur "GET /api/workspaces/owner/{ownerId}"
2. Cliquez "Try it out"
3. Dans "ownerId", mettez `1` (admin)
4. Cliquez "Execute"

**Résultat attendu:** Workspace "Développement"

#### ✅ **POST /api/workspaces** - Créer un workspace
1. Cliquez sur "POST /api/workspaces"
2. Cliquez "Try it out"
3. Request body:
```json
{
  "name": "Mon Nouveau Workspace",
  "description": "Test de création via Swagger",
  "ownerId": 1
}
```
4. Cliquez "Execute"

**Résultat attendu:** HTTP 201 Created avec le workspace créé

---

### **3. Board Management** 📋

#### ✅ **GET /api/boards** - Tous les boards
Résultat: 3 boards créés par le seeder

#### ✅ **GET /api/boards/workspace/{workspaceId}** - Boards d'un workspace
1. Testez avec `workspaceId = 1`
2. Résultat: 2 boards (Sprint Planning + Bug Tracking)

#### ✅ **GET /api/boards/{boardId}/columns** - Colonnes d'un board
1. Utilisez `boardId = 1`
2. Résultat: 4 colonnes (To Do, In Progress, Review, Done)

#### ✅ **POST /api/boards** - Créer un board
```json
{
  "name": "Nouveau Board",
  "description": "Test depuis Swagger",
  "workspaceId": 1
}
```

---

### **4. Task Management** ✅

#### ✅ **GET /api/tasks** - Toutes les tâches
Résultat: ~11 tâches avec différentes priorités

#### ✅ **GET /api/tasks/column/{columnId}** - Tâches d'une colonne
1. Utilisez `columnId = 1` (première colonne To Do)
2. Résultat: Tâches dans cette colonne

#### ✅ **GET /api/tasks/assignee/{assigneeId}** - Tâches d'un user
1. Utilisez `assigneeId = 2` (john_doe)
2. Résultat: Tâches assignées à John

#### ✅ **POST /api/tasks** - Créer une tâche
```json
{
  "title": "Ma nouvelle tâche",
  "description": "Créée via Swagger UI",
  "columnId": 1,
  "assigneeId": 2,
  "priority": "HIGH",
  "position": 0
}
```

#### ✅ **PUT /api/tasks/{taskId}/move** - Drag & Drop
```json
{
  "columnId": 2,
  "position": 0
}
```

#### ✅ **GET /api/tasks/search** - Recherche
1. Parameter `q = "Auth"` 
2. Résultat: Tâches contenant "Auth"

---

### **5. Comment Management** 💬

#### ✅ **GET /api/comments/task/{taskId}** - Commentaires d'une tâche
1. Utilisez `taskId = 1`
2. Résultat: Commentaires sur cette tâche

#### ✅ **POST /api/comments** - Créer un commentaire
```json
{
  "taskId": 1,
  "authorId": 1,
  "text": "Commentaire ajouté via Swagger!"
}
```

#### ✅ **GET /api/comments/task/{taskId}/count** - Nombre de commentaires
1. Utilisez `taskId = 1`
2. Résultat: Nombre total de commentaires

---

### **6. Label Management** 🏷️

#### ✅ **GET /api/labels/board/{boardId}** - Labels d'un board
1. Utilisez `boardId = 1`
2. Résultat: Labels du board de développement

#### ✅ **POST /api/labels** - Créer un label
```json
{
  "name": "nouveau-label",
  "color": "#9B59B6",
  "boardId": 1
}
```

#### ✅ **POST /api/labels/task/{taskId}/label/{labelId}** - Associer label à tâche
1. `taskId = 1`, `labelId = 1`
2. Résultat: Association créée

#### ✅ **GET /api/labels/task/{taskId}** - Labels d'une tâche
Après avoir associé des labels

---

## 🎯 Scénarios de test complets

### **Scénario 1: Workflow complet d'une tâche**
1. Créer un utilisateur → Créer un workspace → Créer un board
2. Créer une tâche dans "To Do" 
3. Ajouter des commentaires
4. Déplacer vers "In Progress" 
5. Ajouter des labels
6. Déplacer vers "Done"

### **Scénario 2: Test des relations**
1. Récupérer un workspace → Ses boards → Leurs colonnes → Leurs tâches
2. Vérifier les assignés, commentaires, labels

### **Scénario 3: Test des recherches**
1. Rechercher des tâches par titre
2. Rechercher des workspaces par nom
3. Filtrer par utilisateur assigné

---

## 🚨 Codes de réponse à vérifier

- **200 OK** - Récupération réussie
- **201 Created** - Création réussie  
- **204 No Content** - Suppression réussie
- **400 Bad Request** - Données invalides
- **404 Not Found** - Ressource introuvable

---

## 🔄 Réinitialiser les données

Pour remettre les données par défaut:
1. Arrêtez l'application 
2. Supprimez les données de la BDD ou changez `spring.jpa.hibernate.ddl-auto=create-drop`
3. Relancez l'application

Le seeder se relancera automatiquement si aucun utilisateur n'existe!

---

**Happy Testing! 🎉**