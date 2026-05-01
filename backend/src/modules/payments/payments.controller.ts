import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, ParseUUIDPipe, Headers, HttpCode, HttpStatus, RawBodyRequest, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('Payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Iniciar pago de un pedido con Wompi' })
  initiatePayment(@CurrentUser() user: User, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.initiatePayment(user, dto);
  }

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de confirmación de Wompi (uso interno)' })
  handleWebhook(
    @Body() payload: any,
    @Headers('x-event-checksum') signature: string,
  ) {
    return this.paymentsService.handleWebhook(payload, signature);
  }

  @Get('my')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mi historial de pagos' })
  findMine(@CurrentUser() user: User, @Query() pagination: PaginationDto) {
    return this.paymentsService.findMyPayments(user.id, pagination);
  }

  @Get(':id/status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consultar estado de un pago' })
  getStatus(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.paymentsService.getPaymentStatus(id, user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Listar todos los pagos' })
  findAll(@Query() pagination: PaginationDto) {
    return this.paymentsService.findAll(pagination);
  }
}
