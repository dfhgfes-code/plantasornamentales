import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── PÚBLICOS ────────────────────────────────────────────────

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar productos con filtros y paginación' })
  findAll(@Query() filters: FilterProductDto) {
    return this.productsService.findAll(filters);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Obtener lista de categorías disponibles' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  // ─── ADMIN ───────────────────────────────────────────────────

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Crear nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Actualizar producto' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[ADMIN] Eliminar producto (soft delete)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/toggle-availability')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Habilitar o deshabilitar producto' })
  toggleAvailability(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.toggleAvailability(id);
  }

  @Patch(':id/stock')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Actualizar stock del producto' })
  updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }
}
