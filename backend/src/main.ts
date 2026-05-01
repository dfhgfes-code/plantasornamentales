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
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3001'),
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

  await app.listen(port);
  console.log(`🌸 Janneth Acevedo Plantas API corriendo en: http://localhost:${port}/${apiPrefix}`);
  console.log(`🌍 Entorno: ${nodeEnv}`);
}

bootstrap();
