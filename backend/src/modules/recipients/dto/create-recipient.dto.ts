import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsOptional, IsBoolean, MaxLength, MinLength,
} from 'class-validator';

export class CreateRecipientDto {
  @ApiProperty({ example: 'Ana Martínez', description: 'Nombre completo del destinatario' })
  @IsString() @MinLength(2) @MaxLength(150)
  fullName: string;

  @ApiPropertyOptional({ example: '3009876543' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'Calle 45 # 12-34 Apto 201' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsString() @MaxLength(100)
  city: string;

  @ApiPropertyOptional({ example: 'Chapinero' })
  @IsOptional() @IsString() @MaxLength(100)
  neighborhood?: string;

  @ApiPropertyOptional({ example: 'Dejar con el portero' })
  @IsOptional() @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: false, description: 'Marcar como destinatario por defecto' })
  @IsOptional() @IsBoolean()
  isDefault?: boolean;
}
