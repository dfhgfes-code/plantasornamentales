import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID del plan seleccionado' })
  @IsUUID()
  planId: string;

  @ApiProperty({ description: 'ID del destinatario que recibirá las flores' })
  @IsUUID()
  recipientId: string;

  @ApiProperty({ example: '2026-05-10', description: 'Fecha de inicio de la suscripción' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: 'Entregar en la mañana' })
  @IsOptional() @IsString()
  notes?: string;
}
