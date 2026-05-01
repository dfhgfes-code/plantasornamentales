import {
  Controller, Get, Post, Patch, Body, Param,
  Query, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear pedido manual desde tienda' })
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Mis pedidos' })
  findMine(@CurrentUser() user: User, @Query() pagination: PaginationDto) {
    return this.ordersService.findMyOrders(user.id, pagination);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Listar todos los pedidos' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  findAll(@Query() pagination: PaginationDto, @Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(pagination, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pedido por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ordersService.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Actualizar estado del pedido' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar pedido pendiente' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ordersService.cancel(id, user);
  }
}
