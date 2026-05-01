import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../../common/enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.SHIPPED })
  @IsEnum(OrderStatus, { message: 'Estado de pedido inválido' })
  status: OrderStatus;

  @ApiPropertyOptional({ example: 'Pedido en camino con transportista' })
  @IsOptional() @IsString()
  notes?: string;
}
