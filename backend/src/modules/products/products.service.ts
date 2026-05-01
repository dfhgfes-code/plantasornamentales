import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // ─── CREAR ───────────────────────────────────────────────────
  async create(dto: CreateProductDto) {
    // Verificar SKU único si se proporciona
    if (dto.sku) {
      const existing = await this.productRepository.findOne({
        where: { sku: dto.sku },
      });
      if (existing) {
        throw new ConflictException(`Ya existe un producto con el SKU: ${dto.sku}`);
      }
    }

    const product = this.productRepository.create({
      ...dto,
      stock: dto.stock ?? 0,
      isAvailable: dto.isAvailable ?? true,
    });

    await this.productRepository.save(product);

    return { message: 'Producto creado exitosamente', data: product };
  }

  // ─── LISTAR (con filtros y paginación) ───────────────────────
  async findAll(filters: FilterProductDto) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      isAvailable,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const query = this.productRepository.createQueryBuilder('product')
      .where('product.deleted_at IS NULL');

    if (search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      query.andWhere('product.category ILIKE :category', { category: `%${category}%` });
    }

    if (isAvailable !== undefined) {
      query.andWhere('product.is_available = :isAvailable', { isAvailable });
    }

    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const validSortFields = ['name', 'price', 'createdAt', 'stock'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`product.${orderField}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      message: 'Productos obtenidos correctamente',
      data: paginate(data, total, page, limit),
    };
  }

  // ─── LISTAR CATEGORÍAS ───────────────────────────────────────
  async getCategories() {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.category IS NOT NULL')
      .andWhere('product.deleted_at IS NULL')
      .getRawMany();

    return {
      message: 'Categorías obtenidas correctamente',
      data: result.map((r) => r.category).filter(Boolean),
    };
  }

  // ─── OBTENER UNO ─────────────────────────────────────────────
  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return { message: 'Producto encontrado', data: product };
  }

  // ─── ACTUALIZAR ──────────────────────────────────────────────
  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    // Verificar SKU único si se cambia
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.productRepository.findOne({
        where: { sku: dto.sku },
      });
      if (existing) {
        throw new ConflictException(`Ya existe un producto con el SKU: ${dto.sku}`);
      }
    }

    Object.assign(product, dto);
    await this.productRepository.save(product);

    return { message: 'Producto actualizado correctamente', data: product };
  }

  // ─── ELIMINAR (soft delete) ──────────────────────────────────
  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    await this.productRepository.softDelete(id);

    return { message: 'Producto eliminado correctamente' };
  }

  // ─── TOGGLE DISPONIBILIDAD ───────────────────────────────────
  async toggleAvailability(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    product.isAvailable = !product.isAvailable;
    await this.productRepository.save(product);

    return {
      message: `Producto ${product.isAvailable ? 'habilitado' : 'deshabilitado'} correctamente`,
      data: product,
    };
  }

  // ─── ACTUALIZAR STOCK ────────────────────────────────────────
  async updateStock(id: string, quantity: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    product.stock = quantity;
    if (product.stock <= 0) product.isAvailable = false;
    await this.productRepository.save(product);

    return { message: 'Stock actualizado correctamente', data: product };
  }
}
