import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const { combine, timestamp, errors, json } = winston.format;

export const winstonConfig = () => ({
  transports: [
    // Consola (desarrollo)
    new winston.transports.Console({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        nestWinstonModuleUtilities.format.nestLike('JannethPlantasAPI', {
          prettyPrint: true,
          colors: true,
        }),
      ),
    }),

    // Archivo de errores
    new winston.transports.File({
      filename: `${process.env.LOG_DIR || 'logs'}/error.log`,
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json(),
      ),
    }),

    // Archivo de todos los logs
    new winston.transports.File({
      filename: `${process.env.LOG_DIR || 'logs'}/combined.log`,
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json(),
      ),
    }),
  ],
  level: process.env.LOG_LEVEL || 'debug',
  exitOnError: false,
});
