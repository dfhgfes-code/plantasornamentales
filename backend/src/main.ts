import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Logger personalizado (Winston)
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Prefijo global de la API
  app.setGlobalPrefix(apiPrefix);

  // CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3001');
  
  // Función para validar origin
  const validateOrigin = (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
    // Si no hay origin (peticiones desde el mismo servidor o Postman), permitir
    if (!origin) {
      return callback(null, true);
    }
    
    try {
      // Lista de orígenes permitidos (separados por coma)
      const allowedOrigins = corsOrigin.split(',').map(o => o.trim());
      
      // Verificar si el origin está en la lista o coincide con algún patrón
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        // Si es exacto
        if (origin === allowedOrigin) return true;
        
        // Si tiene wildcard (*), convertir a regex
        if (allowedOrigin.includes('*')) {
          const pattern = allowedOrigin
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*');
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(origin);
        }
        
        return false;
      });
      
      callback(null, isAllowed);
    } catch (error) {
      console.error('Error validating CORS origin:', error);
      callback(null, false);
    }
  };
  
  app.enableCors({
    origin: validateOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtro global de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global de respuestas
  app.useGlobalInterceptors(new TransformInterceptor());

  // Guards globales (JWT + Roles)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Swagger (solo en desarrollo)
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Janneth Acevedo Plantas API')
      .setDescription(
        'API para la plataforma de e-commerce y suscripciones de flores ornamentales',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingresa tu token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Autenticación y registro de usuarios')
      .addTag('Users', 'Gestión de usuarios')
      .addTag('Products', 'Catálogo de productos')
      .addTag('Plans', 'Planes de suscripción')
      .addTag('Subscriptions', 'Suscripciones de usuarios')
      .addTag('Orders', 'Pedidos')
      .addTag('Payments', 'Pagos con Wompi')
      .addTag('Recipients', 'Destinatarios de flores')
      .addTag('Admin', 'Panel administrativo')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.log(`📚 Swagger disponible en: http://localhost:${port}/docs`);
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🌸 Janneth Acevedo Plantas API corriendo en: http://0.0.0.0:${port}/${apiPrefix}`);
  console.log(`🌍 Entorno: ${nodeEnv}`);
}

bootstrap();
