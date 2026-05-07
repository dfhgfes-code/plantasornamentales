import { Controller, Get, Patch, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todas las configuraciones de la tienda' })
  async findAll() {
    const data = await this.settingsService.findAll();
    return { message: 'Configuraciones obtenidas', data };
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: false, forbidNonWhitelisted: false, transform: true }))
  @ApiOperation({ summary: 'Actualizar configuraciones (Solo Admin)' })
  async update(@Body() settings: Record<string, string>) {
    const data = await this.settingsService.updateMany(settings);
    return { message: 'Configuraciones actualizadas', data };
  }
}
