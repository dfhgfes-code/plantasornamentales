import {
  Controller, Get, Post, Patch, Body, Param,
  Query, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('Subscriptions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva suscripción' })
  create(@CurrentUser() user: User, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Mis suscripciones' })
  findMine(@CurrentUser() user: User) {
    return this.subscriptionsService.findMySubscriptions(user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Listar todas las suscripciones' })
  findAll(@Query() pagination: PaginationDto) {
    return this.subscriptionsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener suscripción por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.subscriptionsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar suscripción (cambiar destinatario o notas)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubscriptionDto,
    @CurrentUser() user: User,
  ) {
    return this.subscriptionsService.update(id, dto, user);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pausar suscripción' })
  pause(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.subscriptionsService.pause(id, user);
  }

  @Patch(':id/resume')
  @ApiOperation({ summary: 'Reactivar suscripción pausada' })
  resume(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.subscriptionsService.resume(id, user);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar suscripción' })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelSubscriptionDto,
    @CurrentUser() user: User,
  ) {
    return this.subscriptionsService.cancel(id, dto, user);
  }
}
