import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ description: 'Cambiar destinatario' })
  @IsOptional() @IsUUID()
  recipientId?: string;

  @ApiPropertyOptional({ example: 'Nueva nota de entrega' })
  @IsOptional() @IsString()
  notes?: string;
}
