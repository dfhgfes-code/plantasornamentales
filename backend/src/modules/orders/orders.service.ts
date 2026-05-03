import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Recipient } from '../recipients/entities/recipient.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { MailService } from '../../common/services/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Recipient)
    private readonly recipientRepository: Repository<Recipient>,
    private readonly mailService: MailService,
  ) {}

  // ─── CREAR PEDIDO MANUAL ─────────────────────────────────────
  async create(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El pedido debe tener al menos un producto');
    }

    // Validar productos y calcular totales
    const orderItems: Partial<OrderItem>[] = [];
    let subtotal = 0;

    for (const item of dto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId, isAvailable: true },
      });
      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no encontrado o no disponible`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}`);
      }

      const itemSubtotal = Number(product.price) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        unitPrice: Number(product.price),
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    const deliveryFee = 8000; // Tarifa fija de envío
    const total = subtotal + deliveryFee;

    // Generar número de orden único
    const orderNumber = await this.generateOrderNumber();

    // Obtener dirección del destinatario si se proporciona
    let deliveryAddress = dto.deliveryAddress;
    let deliveryCity = dto.deliveryCity;

    if (dto.recipientId) {
      const recipient = await this.recipientRepository.findOne({
        where: { id: dto.recipientId },
      });
      if (!recipient) throw new NotFoundException('Destinatario no encontrado');
      if (!deliveryAddress) deliveryAddress = recipient.address;
      if (!deliveryCity) deliveryCity = recipient.city;
    }

    // Crear orden
    const order = this.orderRepository.create({
      orderNumber,
      userId,
      recipientId: dto.recipientId,
      status: OrderStatus.PENDING,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      deliveryCity,
      scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
      notes: dto.notes,
      isAutomatic: false,
    });

    await this.orderRepository.save(order);

    // Crear items y descontar stock
    for (const item of orderItems) {
      const orderItem = this.orderItemRepository.create({ ...item, orderId: order.id });
      await this.orderItemRepository.save(orderItem);

      await this.productRepository.decrement({ id: item.productId }, 'stock', item.quantity);
    }

    const savedOrder = await this.getOrderWithItems(order.id);
    if (savedOrder.user?.email) {
      this.mailService.sendOrderConfirmation(savedOrder.user.email, savedOrder);
    }

    return { message: 'Pedido creado exitosamente', data: savedOrder };
  }

  // ─── CREAR PEDIDO AUTOMÁTICO (desde suscripción) ─────────────
  async createFromSubscription(subscription: Subscription): Promise<Order> {
    const orderNumber = await this.generateOrderNumber();

    const recipient = await this.recipientRepository.findOne({
      where: { id: subscription.recipientId },
    });

    const order = this.orderRepository.create({
      orderNumber,
      userId: subscription.userId,
      subscriptionId: subscription.id,
      recipientId: subscription.recipientId,
      status: OrderStatus.PENDING,
      subtotal: Number(subscription.plan.price),
      deliveryFee: 0, // Incluido en el plan
      total: Number(subscription.plan.price),
      deliveryAddress: recipient?.address,
      deliveryCity: recipient?.city,
      isAutomatic: true,
      notes: subscription.notes,
    });

    await this.orderRepository.save(order);
    return order;
  }

  // ─── MIS PEDIDOS ─────────────────────────────────────────────
  async findMyOrders(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.orderRepository.findAndCount({
      where: { userId },
      relations: ['items', 'items.product', 'recipient'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      message: 'Pedidos obtenidos correctamente',
      data: paginate(data, total, page, limit),
    };
  }

  // ─── ADMIN: todos los pedidos ────────────────────────────────
  async findAll(pagination: PaginationDto, status?: OrderStatus) {
    const { page = 1, limit = 10 } = pagination;
    const where = status ? { status } : {};
    const [data, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['user', 'items', 'recipient'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      message: 'Pedidos obtenidos correctamente',
      data: paginate(data, total, page, limit),
    };
  }

  // ─── OBTENER UNO ─────────────────────────────────────────────
  async findOne(id: string, requestingUser: User) {
    const order = await this.getOrderWithItems(id);
    if (!order) throw new NotFoundException('Pedido no encontrado');
    if (order.userId !== requestingUser.id && requestingUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes acceso a este pedido');
    }
    return { message: 'Pedido encontrado', data: order };
  }

  // ─── ADMIN: actualizar estado ────────────────────────────────
  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('No se puede cambiar el estado de un pedido finalizado');
    }

    order.status = dto.status;
    if (dto.notes) order.notes = dto.notes;
    if (dto.status === OrderStatus.DELIVERED) order.deliveredAt = new Date();

    await this.orderRepository.save(order);
    return { message: 'Estado del pedido actualizado', data: order };
  }

  // ─── CANCELAR (usuario) ──────────────────────────────────────
  async cancel(id: string, requestingUser: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    if (order.userId !== requestingUser.id && requestingUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes acceso a este pedido');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Solo se pueden cancelar pedidos pendientes');
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    // Restaurar stock
    const items = await this.orderItemRepository.find({ where: { orderId: order.id } });
    for (const item of items) {
      await this.productRepository.increment({ id: item.productId }, 'stock', item.quantity);
    }

    return { message: 'Pedido cancelado correctamente', data: order };
  }

  // ─── HELPERS ─────────────────────────────────────────────────
  private async getOrderWithItems(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'recipient', 'user'],
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.orderRepository.count();
    const seq = String(count + 1).padStart(5, '0');
    return `ORD-${year}-${seq}`;
  }
}
