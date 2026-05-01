import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsPositive,
  MinLength,
  MaxLength,
  Min,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Rosas Rojas Premium', description: 'Nombre del producto' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Hermosas rosas rojas de tallo largo...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 85000, description: 'Precio en pesos colombianos' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @ApiPropertyOptional({ example: 'https://ejemplo.com/imagen.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 50, description: 'Unidades disponibles en inventario' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 'Rosas', description: 'Categoría del producto' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 'ROS-001', description: 'Código SKU único' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sku?: string;
}
