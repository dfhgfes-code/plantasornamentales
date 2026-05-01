import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsObject } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID del pedido a pagar' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 'CARD', description: 'Método de pago: CARD, PSE, NEQUI' })
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional({ description: 'Token de pago generado por Wompi.js (para tarjetas)' })
  @IsOptional() @IsString()
  paymentToken?: string;

  @ApiPropertyOptional({ description: 'Datos adicionales del método de pago' })
  @IsOptional() @IsObject()
  paymentMethodInfo?: Record<string, any>;
}
