# Script de déploiement PowerShell pour EMS
# Usage: .\deploy.ps1 [--build] [--clean] [--logs]

param(
    [switch]$Build,
    [switch]$Clean,
    [switch]$Logs,
    [switch]$Help
)

Write-Host "🐳 EMS Deployment Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

if ($Help) {
    Write-Host "Usage: .\deploy.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  --build    Force rebuild des images Docker"
    Write-Host "  --clean    Nettoie les conteneurs et volumes existants"
    Write-Host "  --logs     Affiche les logs après démarrage"
    Write-Host "  --help     Affiche cette aide"
    Write-Host ""
    Write-Host "Exemples:"
    Write-Host "  .\deploy.ps1                   # Démarrage simple"
    Write-Host "  .\deploy.ps1 --build           # Rebuild et démarrage"
    Write-Host "  .\deploy.ps1 --clean --build   # Clean complet puis build"
    exit 0
}

try {
    # Vérification que Docker est disponible
    Write-Host "🔍 Vérification de Docker..." -ForegroundColor Yellow
    docker --version | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker n'est pas disponible. Veuillez installer Docker."
    }
    Write-Host "✅ Docker est disponible" -ForegroundColor Green

    # Clean si demandé
    if ($Clean) {
        Write-Host "🧹 Nettoyage des conteneurs existants..." -ForegroundColor Yellow
        docker-compose down -v --remove-orphans
        docker system prune -f
        Write-Host "✅ Nettoyage terminé" -ForegroundColor Green
    }

    # Build des images
    if ($Build) {
        Write-Host "🔨 Construction des images Docker..." -ForegroundColor Yellow
        docker-compose build --no-cache
        if ($LASTEXITCODE -ne 0) {
            throw "Erreur lors de la construction des images"
        }
        Write-Host "✅ Images construites avec succès" -ForegroundColor Green
    }

    # Démarrage des services
    Write-Host "🚀 Démarrage des services..." -ForegroundColor Yellow
    docker-compose up -d
    if ($LASTEXITCODE -ne 0) {
        throw "Erreur lors du démarrage des services"
    }

    # Attente que les services soient prêts
    Write-Host "⏳ Attente du démarrage complet..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30

    # Vérification des services
    Write-Host "🔍 Vérification des services..." -ForegroundColor Yellow
    $containers = docker-compose ps --services --filter "status=running"
    
    Write-Host ""
    Write-Host "📊 Status des services:" -ForegroundColor Cyan
    docker-compose ps

    Write-Host ""
    Write-Host "🌐 URLs disponibles:" -ForegroundColor Cyan
    Write-Host "  • Application Backend: http://localhost:8080" -ForegroundColor White
    Write-Host "  • API Documentation:   http://localhost:8080/swagger-ui.html" -ForegroundColor White
    Write-Host "  • Health Check:        http://localhost:8080/api/public/health" -ForegroundColor White
    Write-Host "  • Base de données:     localhost:5432 (postgres/postgre)" -ForegroundColor White

    if ($Logs) {
        Write-Host ""
        Write-Host "📝 Logs des services..." -ForegroundColor Yellow
        docker-compose logs -f
    } else {
        Write-Host ""
        Write-Host "💡 Pour voir les logs: docker-compose logs -f" -ForegroundColor Yellow
        Write-Host "💡 Pour arrêter:       docker-compose down" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "🎉 Déploiement réussi!" -ForegroundColor Green

} catch {
    Write-Host ""
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    Write-Host "💡 Consultez les logs: docker-compose logs" -ForegroundColor Yellow
    exit 1
}