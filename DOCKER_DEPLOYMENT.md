# 🐳 Docker Deployment - EMS Application

Guide de déploiement avec Docker et docker-compose pour l'application EMS (Employee Management System).

## 📋 Prérequis

- **Docker Desktop** installé et fonctionnel
- **Docker Compose** (inclus avec Docker Desktop)
- **Portainer** (optionnel, pour interface graphique)

## 🚀 Déploiement rapide

### Option 1: Script automatique (Recommandé)
```powershell
# Déploiement complet avec build
.\deploy.ps1 --build

# Ou déploiement simple (si images déjà construites)
.\deploy.ps1
```

### Option 2: Commandes manuelles
```bash
# Construction et démarrage
docker-compose up --build -d

# Vérification des services
docker-compose ps

# Logs des services
docker-compose logs -f
```

## 📦 Architecture des conteneurs

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ems-frontend  │    │  ems-application │    │   ems-postgres  │
│   (Nginx)       │◄──►│  (Spring Boot)   │◄──►│   (PostgreSQL)  │
│   Port: 4200    │    │   Port: 8080     │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                        ems-network (bridge)
```

## 🌐 URLs disponibles

| Service | URL | Description |
|---------|-----|-------------|
| **Application Backend** | http://localhost:8080 | API REST principal |
| **Documentation API** | http://localhost:8080/swagger-ui.html | Interface Swagger |
| **Health Check** | http://localhost:8080/api/public/health | Vérification santé |
| **Base de données** | localhost:5432 | PostgreSQL (postgres/postgre) |
| **Frontend Angular** | http://localhost:4200 | Interface utilisateur |

## 🔧 Configuration

### Variables d'environnement
Les principales variables sont définies dans `docker-compose.yml`:

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/ems_db
  SPRING_PROFILES_ACTIVE: docker
  SERVER_PORT: 8080
```

### Profils Spring
- **dev**: Développement local (base H2)
- **docker**: Conteneurs Docker (PostgreSQL)

## 📊 Monitoring avec Portainer

1. **Accéder à Portainer**: http://localhost:9000
2. **Voir les conteneurs**: Containers → Running
3. **Consulter les logs**: Container → Logs
4. **Monitoring ressources**: Container → Stats

## 🛠️ Commandes utiles

```bash
# Démarrage des services
docker-compose up -d

# Construction forcée des images
docker-compose build --no-cache

# Redémarrage d'un service
docker-compose restart ems-app

# Voir les logs d'un service
docker-compose logs ems-app

# Accès shell au conteneur
docker exec -it ems-application bash

# Arrêt complet
docker-compose down

# Arrêt avec suppression des volumes
docker-compose down -v
```

## 🔍 Troubleshooting

### Problème de port occupé
```bash
# Changer le port dans docker-compose.yml
ports:
  - "8081:8080"  # Au lieu de 8080:8080
```

### Base de données ne démarre pas
```bash
# Vérifier les logs PostgreSQL
docker-compose logs postgres

# Recréer le volume de données
docker-compose down -v
docker-compose up -d
```

### Application ne se connecte pas à la DB
```bash
# Vérifier la connectivité réseau
docker network ls
docker network inspect ems_ems-network
```

## 🔐 Sécurité

- ✅ Utilisateur non-root dans les conteneurs
- ✅ Health checks configurés
- ✅ Réseau isolé pour les services
- ✅ Volumes persistants pour les données

## 📈 Performance

- **Multi-stage build** pour optimiser la taille des images
- **Alpine Linux** pour des images légères
- **Health checks** pour la résilience
- **Restart policies** pour la haute disponibilité

## 🎯 DevOps / Déploiement

Ce setup Docker démontre:
- ✅ **Containerisation** complète de l'application
- ✅ **Orchestration** avec docker-compose
- ✅ **Automation** avec scripts de déploiement
- ✅ **Monitoring** via Portainer
- ✅ **Configuration** par environnement
- ✅ **Health checks** et résilience