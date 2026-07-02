# Script de Verificacion - Janneth Acevedo Plantas
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "VERIFICACION DE CONFIGURACION LOCAL" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Verificar PostgreSQL
Write-Host "1. PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version 2>$null
    if ($pgVersion) {
        Write-Host "   OK - Instalado: $pgVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "   NO INSTALADO" -ForegroundColor Red
    Write-Host "   Opcion A: Descargar de postgresql.org" -ForegroundColor Gray
    Write-Host "   Opcion B: Usar Docker" -ForegroundColor Gray
}

# Verificar Docker
Write-Host "`n2. Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "   OK - $dockerVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "   NO INSTALADO" -ForegroundColor Red
}

# Verificar Node.js
Write-Host "`n3. Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "   OK - Node $nodeVersion" -ForegroundColor Green
    Write-Host "   OK - npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   NO INSTALADO" -ForegroundColor Red
}

# Verificar archivos .env
Write-Host "`n4. Archivos de configuracion..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "   OK - backend/.env existe" -ForegroundColor Green
} else {
    Write-Host "   FALTA - backend/.env" -ForegroundColor Red
}

if (Test-Path "frontend\.env.local") {
    Write-Host "   OK - frontend/.env.local existe" -ForegroundColor Green
} else {
    Write-Host "   FALTA - frontend/.env.local" -ForegroundColor Yellow
}

# Verificar dependencias
Write-Host "`n5. Dependencias..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "   OK - Backend node_modules" -ForegroundColor Green
} else {
    Write-Host "   FALTA - Ejecuta 'npm install' en backend/" -ForegroundColor Yellow
}

if (Test-Path "frontend\node_modules") {
    Write-Host "   OK - Frontend node_modules" -ForegroundColor Green
} else {
    Write-Host "   FALTA - Ejecuta 'npm install' en frontend/" -ForegroundColor Yellow
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "RESUMEN" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Ver detalles completos en: DIAGNOSTICO_LOCALHOST.md" -ForegroundColor White
Write-Host ""
