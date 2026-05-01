import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterProductDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'rosas', description: 'Buscar por nombre o descripción' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'Rosas', description: 'Filtrar por categoría' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: true, description: 'Solo productos disponibles' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 50000, description: 'Precio mínimo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 200000, description: 'Precio máximo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 'price', enum: ['name', 'price', 'createdAt'] })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'ASC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
