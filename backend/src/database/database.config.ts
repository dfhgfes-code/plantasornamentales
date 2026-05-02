import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get<string>('database.url');
    const isProduction = this.configService.get<string>('app.nodeEnv') === 'production';

    // Si hay DATABASE_URL (Supabase), usarla directamente
    if (databaseUrl) {
      return {
        type: 'postgres',
        url: databaseUrl,
        ssl: { rejectUnauthorized: false },
        entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
        migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
        synchronize: true, // TEMPORAL: Crear tablas automáticamente
        logging: !isProduction ? ['query', 'error'] : ['error'],
        migrationsRun: false,
        retryAttempts: 3,
        retryDelay: 3000,
      };
    }

    // Configuración individual por variables
    const host = this.configService.get<string>('database.host');
    const sslEnabled = this.configService.get<boolean>('database.ssl');
    return {
      type: 'postgres',
      host,
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
      ssl: sslEnabled ? ({ rejectUnauthorized: false } as any) : false,
      extra: sslEnabled ? { ssl: { rejectUnauthorized: false } } : {},
      entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      synchronize: true, // TEMPORAL: Crear tablas automáticamente
      logging: !isProduction ? ['query', 'error'] : ['error'],
      migrationsRun: false,
      retryAttempts: 3,
      retryDelay: 3000,
    };
  }
}
