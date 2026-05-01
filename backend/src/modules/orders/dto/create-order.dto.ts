import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID, IsOptional, IsString, IsArray,
  ValidateNested, IsNumber, IsPositive, IsInt, Min, IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2, description: 'Cantidad' })
  @IsInt() @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Productos del pedido' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ description: 'ID del destinatario (si es diferente al perfil)' })
  @IsOptional() @IsUUID()
  recipientId?: string;

  @ApiPropertyOptional({ example: 'Calle 45 # 12-34', description: 'Dirección de entrega' })
  @IsOptional() @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional({ example: 'Bogotá' })
  @IsOptional() @IsString()
  deliveryCity?: string;

  @ApiPropertyOptional({ example: '2026-05-15', description: 'Fecha programada de entrega' })
  @IsOptional() @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional({ example: 'Tocar el timbre dos veces' })
  @IsOptional() @IsString()
  notes?: string;
}
