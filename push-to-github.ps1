# Script para subir el proyecto a GitHub
# Reemplaza TU_TOKEN_AQUI con tu Personal Access Token de GitHub

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "SUBIR PROYECTO A GITHUB" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

$token = Read-Host "Pega tu Personal Access Token de GitHub"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ No se proporcionó ningún token" -ForegroundColor Red
    Write-Host "`nPara crear un token:" -ForegroundColor Yellow
    Write-Host "1. Ve a: https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "2. Click en 'Generate new token (classic)'" -ForegroundColor Gray
    Write-Host "3. Marca la opción 'repo'" -ForegroundColor Gray
    Write-Host "4. Genera y copia el token" -ForegroundColor Gray
    exit 1
}

Write-Host "`n📤 Subiendo código a GitHub..." -ForegroundColor Yellow

# Crear URL con el token
$repoUrl = "https://$token@github.com/dfhgfes-code/plantasornamentales.git"

# Configurar el remoto con el token
git remote set-url origin $repoUrl

# Hacer push
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Código subido exitosamente!" -ForegroundColor Green
    Write-Host "📁 Repositorio: https://github.com/dfhgfes-code/plantasornamentales" -ForegroundColor Cyan
    
    # Remover el token de la URL por seguridad (dejar solo HTTPS)
    git remote set-url origin "https://github.com/dfhgfes-code/plantasornamentales.git"
} else {
    Write-Host "`n❌ Error al subir el código" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "- El token sea válido" -ForegroundColor Gray
    Write-Host "- El repositorio exista" -ForegroundColor Gray
    Write-Host "- Tengas permisos de escritura" -ForegroundColor Gray
}

Write-Host "`n================================================`n" -ForegroundColor Cyan
