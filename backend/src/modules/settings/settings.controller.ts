import { Controller, Get, Patch, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las configuraciones de la tienda' })
  findAll() {
    return this.settingsService.findAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: false, forbidNonWhitelisted: false }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar configuraciones (Solo Admin)' })
  update(@Body() settings: Record<string, string>) {
    console.log('[SettingsController] Incoming update:', settings);
    return this.settingsService.updateMany(settings);
  }
}
