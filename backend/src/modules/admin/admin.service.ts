import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { SubscriptionStatus } from '../../common/enums/subscription-status.enum';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getDashboard() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      activeSubscriptions,
      pendingOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      // Totales
      this.userRepository.count({ where: { isActive: true } }),
      this.productRepository.count({ where: { isAvailable: true } }),
      this.orderRepository.count(),
      this.subscriptionRepository.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),

      // Ingresos totales (pagos aprobados)
      this.paymentRepository
        .createQueryBuilder('p')
        .select('SUM(p.amount)', 'total')
        .where('p.status = :status', { status: PaymentStatus.APPROVED })
        .getRawOne(),

      // Últimos 5 pedidos
      this.orderRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),

      // Productos con stock bajo (< 5)
      this.productRepository
        .createQueryBuilder('p')
        .where('p.stock < :min', { min: 5 })
        .andWhere('p.is_available = true')
        .andWhere('p.deleted_at IS NULL')
        .getMany(),
    ]);

    // Pedidos por estado
    const ordersByStatus = await this.orderRepository
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('o.status')
      .getRawMany();

    // Ingresos últimos 7 días
    const last7Days = await this.paymentRepository
      .createQueryBuilder('p')
      .select("DATE_TRUNC('day', p.paid_at)", 'day')
      .addSelect('SUM(p.amount)', 'total')
      .where('p.status = :status', { status: PaymentStatus.APPROVED })
      .andWhere("p.paid_at >= NOW() - INTERVAL '7 days'")
      .groupBy("DATE_TRUNC('day', p.paid_at)")
      .orderBy("DATE_TRUNC('day', p.paid_at)", 'ASC')
      .getRawMany();

    return {
      message: 'Dashboard obtenido correctamente',
      data: {
        summary: {
          totalUsers,
          totalProducts,
          totalOrders,
          activeSubscriptions,
          pendingOrders,
          totalRevenue: Number(totalRevenue?.total || 0),
        },
        ordersByStatus,
        recentOrders,
        lowStockProducts,
        revenueLastWeek: last7Days,
      },
    };
  }
}
