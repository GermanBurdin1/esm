# Système de Gestion des Employés (EMS)

Application Spring Boot pour la gestion des employés utilisant Java 21, PostgreSQL et des technologies modernes.

## Technologies

- **Java 21**
- **Spring Boot 3.2.1**
- **Spring Data JPA** – pour l'accès à la base de données
- **Spring Security** – pour l'authentification et l'autorisation
- **Spring Validation** – pour la validation des données
- **PostgreSQL** – base de données principale
- **Lombok** – pour simplifier le code
- **Swagger/OpenAPI** – pour la documentation de l'API
- **Spring Boot DevTools** – pour le confort du développement

## Configuration

### Base de données PostgreSQL

1. Installez PostgreSQL  
2. Créez la base de données :
```sql
CREATE DATABASE ems;
CREATE USER ems_user WITH ENCRYPTED PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE ems TO ems_user;
```

### Configuration de l’application

Les paramètres se trouvent dans `src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ems
spring.datasource.username=ems_user
spring.datasource.password=strong_password
```

## Lancer l’application

```bash
# Compiler le projet
mvn clean compile

# Démarrer l’application
mvn spring-boot:run
```

## Documentation de l’API

Après le démarrage, la documentation de l’API est disponible :
- Swagger UI : http://localhost:8080/swagger-ui.html
- OpenAPI JSON : http://localhost:8080/api-docs

## Endpoints

### Vérification de l’état (Health Check)
- `GET /api/public/health` – vérifie l’état de l’application (pas d’authentification requise)

### Authentification
Par défaut, l’authentification basique est configurée :
- Login : `admin`
- Mot de passe : `password`

## Structure du projet

```
src/
├── main/
│   ├── java/
│   │   └── com/mycompany/ems/
│   │       ├── EmsApplication.java          # Classe principale de l’application
│   │       ├── config/
│   │       │   ├── SecurityConfig.java     # Config de sécurité
│   │       │   └── OpenApiConfig.java      # Config Swagger
│   │       ├── controller/
│   │       │   └── HealthController.java   # Contrôleur REST
│   │       └── entity/
│   │           └── Employee.java           # Entité JPA
│   └── resources/
│       └── application.properties          # Config de l’application
└── test/
    └── java/
        └── com/mycompany/ems/
            └── EmsApplicationTests.java     # Tests de base
```

## Développement

Le projet utilise Spring Boot DevTools pour le rechargement automatique lors des modifications du code.

## Commandes Maven

```bash
# Compiler
mvn clean compile

# Tester
mvn test

# Démarrer
mvn spring-boot:run

# Créer le JAR
mvn clean package
```