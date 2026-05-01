import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar planes disponibles' })
  @ApiQuery({ name: 'onlyActive', required: false, type: Boolean })
  findAll(@Query('onlyActive') onlyActive?: string) {
    return this.plansService.findAll(onlyActive === 'true');
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener plan por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.plansService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Crear plan' })
  create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Actualizar plan' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[ADMIN] Eliminar plan' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.plansService.remove(id);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Activar/desactivar plan' })
  toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.plansService.toggleActive(id);
  }
}
