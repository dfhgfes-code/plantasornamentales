import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import wompiConfig from './config/wompi.config';
import supabaseConfig from './config/supabase.config';
import { DatabaseConfig } from './database/database.config';
import { winstonConfig } from './config/logger.config';


import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { RecipientsModule } from './modules/recipients/recipients.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, jwtConfig, wompiConfig, supabaseConfig],
    }),

    // Logger Winston global
    WinstonModule.forRootAsync({
      useFactory: winstonConfig,
      inject: [],
    }),

    // Conexión a base de datos
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = new DatabaseConfig(configService);
        return {
          ...dbConfig.createTypeOrmOptions(),
          retryAttempts: 10,
          retryDelay: 5000,
          autoLoadEntities: true,
        } as any;
      },
    }),

    // Scheduler para cron jobs (Fase 8)
    ScheduleModule.forRoot(),

    // Módulos de la aplicación
    HealthModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    RecipientsModule,
    PlansModule,
    SubscriptionsModule,
    OrdersModule,
    PaymentsModule,
    AdminModule,
    SettingsModule,
  ],
})
export class AppModule {}
