import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Verificar estado del servidor y base de datos' })
  async check() {
    const dbConnected = this.dataSource.isInitialized;

    let dbStatus = 'disconnected';
    let dbLatency = null;

    if (dbConnected) {
      try {
        const start = Date.now();
        await this.dataSource.query('SELECT 1');
        dbLatency = Date.now() - start;
        dbStatus = 'connected';
      } catch {
        dbStatus = 'error';
      }
    }

    return {
      message: 'API funcionando correctamente',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        database: {
          status: dbStatus,
          latency: dbLatency ? `${dbLatency}ms` : null,
        },
        uptime: `${Math.floor(process.uptime())}s`,
      },
    };
  }
}
