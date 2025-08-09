# =====================
# Étape 1 : Construction (Builder)
# =====================
FROM maven:3.9.8-eclipse-temurin-21 AS builder

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier uniquement le fichier pom.xml pour utiliser le cache Docker
COPY pom.xml .

# Télécharger les dépendances Maven à l'avance (optimise le cache)
RUN mvn -B -q -DskipTests dependency:go-offline

# Copier le code source du projet
COPY src ./src

# Construire le JAR (sans exécuter les tests)
RUN mvn -B clean package -DskipTests

# =====================
# Étape 2 : Exécution (Runtime)
# =====================
FROM eclipse-temurin:21-jre-alpine

# Créer un utilisateur non privilégié pour la sécurité
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Définir le répertoire de travail
WORKDIR /app

# Copier le JAR depuis l'étape builder
COPY --from=builder /app/target/*.jar app.jar

# Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app

# Passer à l'utilisateur non privilégié
USER appuser

# Exposer le port utilisé par l'application
EXPOSE 8080

# Health check pour surveiller l'état de l'application
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/public/health || exit 1

# Lancer l'application
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]
