# 🚀 Guía Rápida - Janneth Acevedo Plantas

## 📊 Estado Actual

✅ **Frontend:** Funcionando en http://localhost:3001  
⚠️ **Backend:** Compilado pero esperando base de datos  
❌ **PostgreSQL:** No instalado  

## ⚡ LO QUE FALTA PARA QUE FUNCIONE TODO

### 1. Instalar PostgreSQL 🗄️

**OPCIÓN RÁPIDA (Docker - Recomendado):**
```powershell
# Instalar Docker Desktop desde: https://www.docker.com/products/docker-desktop/

# Después ejecutar:
docker run --name postgres-janneth -e POSTGRES_PASSWORD=@Joshuamadrid27 -e POSTGRES_DB=janneth_plantas -p 5432:5432 -d postgres:14
```

**OPCIÓN TRADICIONAL:**
1. Descargar PostgreSQL de https://www.postgresql.org/download/windows/
2. Instalar con password: `@Joshuamadrid27`
3. Crear la base de datos:
```sql
CREATE DATABASE janneth_plantas;
```

### 2. Agregar credenciales de Supabase ☁️

Editar `backend/.env` y agregar estas líneas:

```env
SUPABASE_URL=https://pucdbmecnqduihflppi.supabase.co
SUPABASE_KEY=tu_clave_aqui
SUPABASE_BUCKET=plantas-images
```

Para obtener la clave:
1. Ir a https://supabase.com
2. Entrar al proyecto
3. Settings → API → copiar "anon public" key

### 3. Ejecutar migraciones 📦

```powershell
cd backend
npm run migration:run
```

### 4. ¡Listo! 🎉

Ya tienes todo funcionando:
- **Frontend:** http://localhost:3001
- **Backend:** http://localhost:3000/api/v1
- **Docs:** http://localhost:3000/api/docs

---

## 🔍 Scripts Útiles

```powershell
# Verificar configuración
.\check-setup.ps1

# Backend
cd backend
npm run start:dev      # Modo desarrollo (ya está corriendo)
npm run migration:run  # Ejecutar migraciones
npm run build          # Compilar para producción

# Frontend
cd frontend
npm run dev     # Modo desarrollo (ya está corriendo)
npm run build   # Compilar para producción
```

---

## 📝 Archivos Importantes

- **DIAGNOSTICO_LOCALHOST.md** - Diagnóstico completo y detallado
- **check-setup.ps1** - Script para verificar configuración
- **backend/.env** - Variables de entorno del backend
- **frontend/.env.local** - Variables de entorno del frontend

---

## ❓ Problemas Comunes

### "Error connecting to database"
➡️ PostgreSQL no está instalado o no está corriendo  
Solución: Ver paso 1 arriba

### "Faltan credenciales de Supabase"
➡️ No están configuradas en backend/.env  
Solución: Ver paso 2 arriba

### "Cannot find module"
➡️ Faltan dependencias  
Solución: `npm install` en la carpeta correspondiente

---

## 🎯 Configuración para Desarrollo Local

Si quieres que el frontend use tu backend local en vez de producción:

Editar `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## ✅ Checklist

- [ ] PostgreSQL instalado y corriendo
- [ ] Credenciales de Supabase en backend/.env
- [ ] Migraciones ejecutadas
- [ ] Backend corriendo sin errores
- [ ] Frontend accesible en http://localhost:3001

¡Completa esta lista y tendrás todo funcionando! 🚀
