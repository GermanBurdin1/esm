# Dockerfile pour l'application Spring Boot EMS
FROM eclipse-temurin:21-jdk-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers Maven
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Copier le code source
COPY src src

# Construire l'application (ignorer les tests pour une construction rapide)
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Image finale
FROM eclipse-temurin:21-jre-alpine

# Créer un utilisateur pour la sécurité
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier JAR depuis l'étape builder
COPY --from=builder /app/target/*.jar app.jar

# Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app

# Passer à un utilisateur non privilégié
USER appuser

# Ouvrir le port
EXPOSE 8080

# Vérification de l'état (Health check)
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/public/health || exit 1

# Démarrer l'application
ENTRYPOINT ["java", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-Dspring.profiles.active=docker", \
    "-jar", \
    "app.jar"]