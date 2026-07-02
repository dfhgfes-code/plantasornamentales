# 🚂 Verificar Despliegue en Railway

## ✅ Pasos Completados (según tu mensaje)
1. ✅ DATABASE_URL corregida con password codificada (%40 en lugar de @)
2. ✅ Servicio muestra estado "Online"

## 🔍 Verificaciones Necesarias en Railway

### 1. Ver los LOGS del despliegue
En Railway, ve a tu servicio y haz clic en la pestaña **"Deployments"** o **"Logs"**:

#### Busca estos mensajes de ERROR:
```
❌ Database connection failed
❌ Cannot connect to database
❌ TypeORM connection error
❌ Port already in use
❌ Application failed to start
```

#### O busca estos mensajes de ÉXITO:
```
✅ Nest application successfully started
✅ Application is running on: http://[::]:3000
✅ Database connected successfully
```

### 2. Verificar Variables de Entorno
En Railway > Settings > Variables, confirma que estas existen:

**CRÍTICAS:**
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgresql://postgres.qbnyqiibvcouysoygsq:%40Joshuamadrid27@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
  - **IMPORTANTE**: La contraseña DEBE tener `%40` NO `@`
- `DB_SSL=true`
- `JWT_SECRET` (cualquier valor largo y seguro)

### 3. Verificar Root Directory
En Railway > Settings:
- **Root Directory** debe ser: `backend`
- **Start Command** debe ser: `npm run start:prod`
- O si usas Procfile: debe estar en `backend/Procfile`

### 4. Verificar el Dominio Público
En Railway > Settings > Networking:
- Debe haber un dominio generado como: `*.up.railway.app`
- Copia el dominio EXACTO (el tuyo podría ser diferente a los que probé)

## 🐛 Errores Comunes

### Error 502 (Bad Gateway)
**Causa**: La aplicación NO está escuchando correctamente
**Solución**:
1. Verifica que `PORT=3000` esté en las variables
2. Verifica que el código usa `process.env.PORT`
3. Revisa los logs para ver el error real

### Error 404 (Not Found)  
**Causa**: El dominio no existe o el servicio fue eliminado
**Solución**:
1. Verifica que el servicio sigue existiendo en Railway
2. Copia el dominio correcto desde Railway > Settings

### Connection Timeout
**Causa**: DATABASE_URL incorrecta o Supabase bloqueando conexión
**Solución**:
1. Verifica que la contraseña tiene `%40` no `@`
2. En Supabase > Settings > Database, verifica que "Connection pooling" permite conexiones externas

## 📋 ¿Qué necesito que hagas?

Por favor copia y pega aquí:

1. **El dominio EXACTO** que ves en Railway > Settings > Networking
   
2. **Las primeras 30 líneas de LOGS** del último deployment:
   - Ve a Railway > Deployments > Click en el último deployment
   - Copia los logs que aparecen

3. **El estado del deployment**:
   - ¿Dice "Success" o "Failed"?
   - ¿Cuándo fue el último deployment?

Con esa información podré diagnosticar el problema exacto.

## 🎯 URL Correcta para Probar

Una vez tengas el dominio correcto de Railway, prueba:
```
https://TU-DOMINIO-RAILWAY.up.railway.app/api/v1/health
```

Debe responder:
```json
{
  "status": "ok",
  "timestamp": "2026-07-02T..."
}
```
