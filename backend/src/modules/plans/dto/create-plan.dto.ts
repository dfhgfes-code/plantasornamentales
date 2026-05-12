import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNumber, IsOptional, IsBoolean,
  IsPositive, MinLength, MaxLength, IsEnum, IsArray, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreatePlanDto {
  @ApiProperty({ example: 'Plan Semanal Premium' })
  @IsString() @MinLength(2) @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Flores premium cada semana' })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ example: 95000 })
  @Type(() => Number) @IsNumber() @IsPositive()
  price: number;

  @ApiProperty({ example: 30, description: 'Intervalo de días para la suscripción (ej. 7, 15, 30)' })
  @Type(() => Number) @IsNumber() @Min(1)
  intervalDays: number;

  @ApiPropertyOptional({ example: 1, description: 'Entregas incluidas en el período' })
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1)
  deliveryCount?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'https://imagen.com/plan.jpg' })
  @IsOptional() @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: ['Entrega a domicilio', 'Flores frescas'] })
  @IsOptional() @IsArray() @IsString({ each: true })
  features?: string[];
}
