# 🌸 Janneth Acevedo Plantas Ornamentales

Plataforma de e-commerce y suscripciones de flores ornamentales.

## Estructura del Proyecto

```
janneth-acevedo-plantas/
├── backend/          # API NestJS
└── frontend/         # React/Next.js (Fase 10)
```

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS + TypeScript |
| Base de datos | PostgreSQL (Supabase) |
| ORM | TypeORM |
| Autenticación | JWT + Passport |
| Pagos | Wompi |
| Logs | Winston |
| Documentación | Swagger/OpenAPI |
| Scheduler | @nestjs/schedule |

## Fases de Desarrollo

- [x] **Fase 1** - Configuración inicial del proyecto
- [ ] **Fase 2** - Diseño de base de datos
- [ ] **Fase 3** - Autenticación de usuarios
- [ ] **Fase 4** - Gestión de productos
- [ ] **Fase 5** - Sistema de planes y suscripciones
- [ ] **Fase 6** - Sistema de pedidos
- [ ] **Fase 7** - Integración de pagos (Wompi)
- [ ] **Fase 8** - Automatización (Cron Jobs)
- [ ] **Fase 9** - Panel administrativo
- [ ] **Fase 10** - Frontend

## Inicio Rápido

### Prerrequisitos
- Node.js >= 18
- PostgreSQL >= 14 (o cuenta en Supabase)
- npm >= 9

### Instalación

```bash
# 1. Instalar dependencias del backend
cd backend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Iniciar en modo desarrollo
npm run start:dev
```

### URLs disponibles

| Servicio | URL |
|---------|-----|
| API | http://localhost:3000/api/v1 |
| Swagger | http://localhost:3000/docs |
| Health Check | http://localhost:3000/api/v1/health |

## Configuración de Base de Datos

### Opción A: Supabase (recomendado para producción)
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Copiar la connection string
3. Agregar en `.env`: `DATABASE_URL=postgresql://...`

### Opción B: PostgreSQL local
```bash
# Crear base de datos
createdb janneth_plantas

# Configurar en .env:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=janneth_plantas
```

## Documentación de la API

Con el servidor corriendo, visitar: **http://localhost:3000/docs**

Todos los endpoints están documentados con Swagger/OpenAPI.

## Estructura de Carpetas (Backend)

```
backend/src/
├── config/           # Configuraciones (DB, JWT, Wompi, Logger)
├── database/         # DataSource y migraciones
├── common/
│   ├── decorators/   # Decoradores personalizados
│   ├── dto/          # DTOs compartidos (paginación)
│   ├── entities/     # Entidad base
│   ├── enums/        # Enumeraciones del sistema
│   ├── filters/      # Filtros de excepciones
│   └── interceptors/ # Interceptores de respuesta
└── modules/
    ├── health/       # Health check
    ├── auth/         # Autenticación (Fase 3)
    ├── users/        # Usuarios (Fase 3)
    ├── products/     # Productos (Fase 4)
    ├── plans/        # Planes (Fase 5)
    ├── subscriptions/# Suscripciones (Fase 5)
    ├── recipients/   # Destinatarios (Fase 5)
    ├── orders/       # Pedidos (Fase 6)
    ├── payments/     # Pagos Wompi (Fase 7)
    └── admin/        # Panel admin (Fase 9)
```
