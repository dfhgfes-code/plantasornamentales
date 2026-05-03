import {
  Controller, Get, Post, Patch, Delete, Body,
  Param, Query, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { extname, join } from 'path';
import { memoryStorage } from 'multer';
import { AdminService } from './admin.service';
import { SupabaseService } from '../../common/services/supabase.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ProductsService } from '../products/products.service';
import { PlansService } from '../plans/plans.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { CreatePlanDto } from '../plans/dto/create-plan.dto';
import { UpdatePlanDto } from '../plans/dto/update-plan.dto';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productsService: ProductsService,
    private readonly plansService: PlansService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly supabaseService: SupabaseService,
  ) {}


  // ─── DASHBOARD ───────────────────────────────────────────────
  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard con métricas' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  // ─── SUPER ANALYTICS ─────────────────────────────────────────
  @Get('super-analytics')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Analytics avanzados solo para SuperAdmin' })
  getSuperAnalytics() {
    return this.adminService.getSuperAnalytics();
  }

  // ─── UPLOAD DE IMAGEN ────────────────────────────────────────
  @Post('upload')
  @ApiOperation({ summary: 'Subir imagen de producto a Supabase' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
        return cb(new BadRequestException('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    
    try {
      const result = await this.supabaseService.uploadFile(file);
      return {
        message: 'Imagen subida correctamente a la nube',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException('Error al subir imagen a Supabase: ' + error.message);
    }
  }


  // ─── PRODUCTOS ───────────────────────────────────────────────
  @Get('products')
  @ApiOperation({ summary: 'Listar todos los productos (admin)' })
  getProducts(@Query() pagination: PaginationDto) {
    return this.productsService.findAll({ ...pagination, isAvailable: undefined });
  }

  @Post('products')
  @ApiOperation({ summary: 'Crear producto' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Actualizar producto' })
  updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar producto' })
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Patch('products/:id/toggle')
  @ApiOperation({ summary: 'Activar/desactivar producto' })
  toggleProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.toggleAvailability(id);
  }

  // ─── PLANES ──────────────────────────────────────────────────
  @Get('plans')
  @ApiOperation({ summary: 'Listar planes' })
  getPlans() {
    return this.plansService.findAll(false);
  }

  @Post('plans')
  @ApiOperation({ summary: 'Crear plan' })
  createPlan(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Patch('plans/:id')
  @ApiOperation({ summary: 'Actualizar plan' })
  updatePlan(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(id, dto);
  }

  @Delete('plans/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar plan' })
  deletePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.plansService.remove(id);
  }

  // ─── USUARIOS ────────────────────────────────────────────────
  @Get('users')
  @ApiOperation({ summary: 'Listar usuarios' })
  getUsers(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Patch('users/:id/toggle')
  @ApiOperation({ summary: 'Activar/desactivar usuario' })
  toggleUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.toggleActive(id);
  }

  @Patch('users/:id/make-admin')
  @ApiOperation({ summary: 'Dar rol admin a usuario' })
  makeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.changeRole(id, UserRole.ADMIN);
  }

  // ─── PEDIDOS ─────────────────────────────────────────────────
  @Get('orders')
  @ApiOperation({ summary: 'Listar pedidos' })
  getOrders(@Query() pagination: PaginationDto) {
    return this.ordersService.findAll(pagination);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Actualizar estado de pedido' })
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
