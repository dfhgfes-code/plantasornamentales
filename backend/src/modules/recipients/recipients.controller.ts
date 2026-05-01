import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecipientsService } from './recipients.service';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Recipients')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recipients')
export class RecipientsController {
  constructor(private readonly recipientsService: RecipientsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear destinatario' })
  create(@CurrentUser() user: User, @Body() dto: CreateRecipientDto) {
    return this.recipientsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mis destinatarios' })
  findAll(@CurrentUser() user: User) {
    return this.recipientsService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener destinatario por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.recipientsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar destinatario' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRecipientDto,
    @CurrentUser() user: User,
  ) {
    return this.recipientsService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar destinatario' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.recipientsService.remove(id, user);
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Marcar como destinatario predeterminado' })
  setDefault(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.recipientsService.setDefault(id, user.id);
  }
}
