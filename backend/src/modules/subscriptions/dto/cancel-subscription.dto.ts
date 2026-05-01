import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelSubscriptionDto {
  @ApiPropertyOptional({ example: 'Ya no necesito el servicio' })
  @IsOptional() @IsString()
  reason?: string;
}
