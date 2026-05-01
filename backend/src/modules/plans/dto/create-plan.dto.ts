import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNumber, IsOptional, IsBoolean,
  IsPositive, MinLength, MaxLength, IsEnum, IsArray, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlanFrequency } from '../../../common/enums/plan-frequency.enum';

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

  @ApiProperty({ enum: PlanFrequency, example: PlanFrequency.WEEKLY })
  @IsEnum(PlanFrequency, { message: 'Frecuencia debe ser weekly o monthly' })
  frequency: PlanFrequency;

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
