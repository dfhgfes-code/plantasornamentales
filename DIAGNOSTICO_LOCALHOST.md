# 📋 Diagnóstico de Ejecución en Localhost

**Fecha:** 02/07/2026  
**Proyecto:** Janneth Acevedo Plantas Ornamentales

---

## ✅ ESTADO ACTUAL

### Frontend (Next.js)
- **Estado:** ✅ **FUNCIONANDO**
- **Puerto:** `http://localhost:3001`
- **Compilación:** Exitosa
- **Configuración:** `.env.local` presente
- **API URL:** Apuntando a producción en Railway

### Backend (NestJS)
- **Estado:** ⚠️ **PARCIALMENTE FUNCIONAL** 
- **Puerto:** `http://localhost:3000`
- **Compilación:** ✅ Exitosa (después de correcciones)
- **Problemas:** No puede iniciar completamente por falta de base de datos

---

## 🔧 PROBLEMAS ENCONTRADOS Y SOLUCIONADOS

### 1. ✅ Errores de TypeScript (RESUELTOS)

#### Error en `jwt-auth.guard.ts`
**Problema:** Tipo incorrecto en el método `canActivate`
```typescript
// ❌ ANTES
return super.canActivate(context).catch(() => true).then(() => true);

// ✅ DESPUÉS
const result = super.canActivate(context);
if (result instanceof Promise) {
  return result.catch(() => true);
}
return true;
```

#### Error en `register.dto.ts`
**Problema:** Ruta de import incorrecta
```typescript
// ❌ ANTES
import { UserRole } from '../../common/enums/user-role.enum';

// ✅ DESPUÉS
import { UserRole } from '../../../common/enums/user-role.enum';
```

---

## ❌ PROBLEMAS PENDIENTES

### 1. 🗄️ PostgreSQL no está instalado o no está corriendo

**Error:**
```
[TypeOrmModule] Unable to connect to the database. Retrying...
AggregateError [ECONNREFUSED]
```

**Solución requerida:**
1. Instalar PostgreSQL si no está instalado
2. Iniciar el servicio de PostgreSQL
3. Crear la base de datos `janneth_plantas`

**Comandos para Windows:**

```powershell
# Verificar si PostgreSQL está instalado
psql --version

# Si está instalado, iniciar el servicio
net start postgresql-x64-14  # (o la versión instalada)

# Crear la base de datos
psql -U postgres
CREATE DATABASE janneth_plantas;
\q

# Ejecutar migraciones
cd backend
npm run migration:run
```

**Alternativa - Usar Docker:**
```powershell
# Iniciar PostgreSQL con Docker
docker run --name postgres-janneth ^
  -e POSTGRES_PASSWORD=@Joshuamadrid27 ^
  -e POSTGRES_DB=janneth_plantas ^
  -p 5432:5432 ^
  -d postgres:14

# Ejecutar migraciones
cd backend
npm run migration:run
```

### 2. ☁️ Credenciales de Supabase faltantes

**Error:**
```
[SupabaseService] ❌ ERROR: Faltan credenciales de Supabase
```

**Variables faltantes en `.env`:**
```env
SUPABASE_URL=https://pucdbmecnqduihflppi.supabase.co
SUPABASE_KEY=tu_supabase_anon_key_aqui
SUPABASE_BUCKET=plantas-images
```

**Donde obtenerlas:**
1. Ir a [https://supabase.com](https://supabase.com)
2. Entrar al proyecto
3. Settings → API
4. Copiar la URL y la `anon public` key

### 3. 🔄 Frontend apuntando a producción

El archivo `.env.local` del frontend está configurado para usar la API de producción:

```env
NEXT_PUBLIC_API_URL=https://janneth-acevedo-plantas-production.up.railway.app/api/v1
```

**Para desarrollo local, cambiar a:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## 📝 PASOS PARA COMPLETAR LA CONFIGURACIÓN

### Paso 1: Instalar y configurar PostgreSQL

**Opción A - Instalación nativa:**
1. Descargar PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Instalar con password: `@Joshuamadrid27`
3. Iniciar servicio: `net start postgresql-x64-14`
4. Crear base de datos (ver comandos arriba)

**Opción B - Docker (recomendado):**
```powershell
docker run --name postgres-janneth ^
  -e POSTGRES_PASSWORD=@Joshuamadrid27 ^
  -e POSTGRES_DB=janneth_plantas ^
  -p 5432:5432 ^
  -d postgres:14
```

### Paso 2: Agregar credenciales de Supabase

Editar `backend/.env` y agregar:
```env
SUPABASE_URL=https://pucdbmecnqduihflppi.supabase.co
SUPABASE_KEY=tu_supabase_anon_key_aqui
SUPABASE_BUCKET=plantas-images
```

### Paso 3: Ejecutar migraciones de base de datos

```powershell
cd backend
npm run migration:run
```

### Paso 4: (Opcional) Configurar frontend para desarrollo local

Editar `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Paso 5: Reiniciar servicios

```powershell
# Backend (ya está corriendo, se recargará automáticamente)
cd backend
npm run start:dev

# Frontend (ya está corriendo en http://localhost:3001)
cd frontend
npm run dev
```

---

## 🎯 URLS DE ACCESO

Una vez completada la configuración:

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000/api/v1
- **Backend Health:** http://localhost:3000/api/v1/health
- **Swagger Docs:** http://localhost:3000/api/docs

---

## 📊 RESUMEN

| Componente | Estado | Puerto | Notas |
|------------|--------|--------|-------|
| Frontend (Next.js) | ✅ Funcionando | 3001 | Apuntando a producción |
| Backend (NestJS) | ⚠️ Compilado | 3000 | Esperando PostgreSQL |
| PostgreSQL | ❌ No disponible | 5432 | Requiere instalación |
| Supabase | ⚠️ Sin config | - | Faltan credenciales |

---

## 💡 RECOMENDACIONES

1. **Prioridad Alta:** Instalar PostgreSQL o usar Docker para desarrollo local
2. **Prioridad Media:** Obtener credenciales de Supabase del proyecto existente
3. **Opcional:** Configurar frontend para usar backend local durante desarrollo
4. **Considerar:** Usar variables de entorno diferentes para desarrollo/producción

---

## 🔗 RECURSOS

- [Documentación PostgreSQL Windows](https://www.postgresql.org/download/windows/)
- [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [NestJS Database](https://docs.nestjs.com/techniques/database)
