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

  async getSuperAnalytics() {
    // Ingresos por día - últimos 30 días
    const revenueByDay = await this.paymentRepository
      .createQueryBuilder('p')
      .select("TO_CHAR(DATE_TRUNC('day', p.paid_at), 'DD/MM')", 'day')
      .addSelect('SUM(p.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('p.status = :status', { status: 'approved' })
      .andWhere("p.paid_at >= NOW() - INTERVAL '30 days'")
      .groupBy("DATE_TRUNC('day', p.paid_at), TO_CHAR(DATE_TRUNC('day', p.paid_at), 'DD/MM')")
      .orderBy("DATE_TRUNC('day', p.paid_at)", 'ASC')
      .getRawMany();

    // Nuevos usuarios por semana - últimas 4 semanas
    const newUsersPerWeek = await this.userRepository
      .createQueryBuilder('u')
      .select("TO_CHAR(DATE_TRUNC('week', u.created_at), 'DD/MM')", 'week')
      .addSelect('COUNT(*)', 'count')
      .where("u.created_at >= NOW() - INTERVAL '28 days'")
      .groupBy("DATE_TRUNC('week', u.created_at), TO_CHAR(DATE_TRUNC('week', u.created_at), 'DD/MM')")
      .orderBy("DATE_TRUNC('week', u.created_at)", 'ASC')
      .getRawMany();

    // Suscripciones activas vs canceladas
    const subscriptionStats = await this.subscriptionRepository
      .createQueryBuilder('s')
      .select('s.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.status')
      .getRawMany();

    // Resumen ejecutivo
    const [totalRevenue, totalOrders, totalUsers, activeSubscriptions] = await Promise.all([
      this.paymentRepository
        .createQueryBuilder('p')
        .select('SUM(p.amount)', 'total')
        .where('p.status = :status', { status: 'approved' })
        .getRawOne(),
      this.orderRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.subscriptionRepository.count({ where: { status: 'active' as any } }),
    ]);

    // Ingresos este mes vs mes pasado
    const thisMonth = await this.paymentRepository
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .where('p.status = :status', { status: 'approved' })
      .andWhere("p.paid_at >= DATE_TRUNC('month', NOW())")
      .getRawOne();

    const lastMonth = await this.paymentRepository
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .where('p.status = :status', { status: 'approved' })
      .andWhere("p.paid_at >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'")
      .andWhere("p.paid_at < DATE_TRUNC('month', NOW())")
      .getRawOne();

    return {
      message: 'Analytics obtenidos correctamente',
      data: {
        summary: {
          totalRevenue: Number(totalRevenue?.total || 0),
          totalOrders,
          totalUsers,
          activeSubscriptions,
          thisMonthRevenue: Number(thisMonth?.total || 0),
          lastMonthRevenue: Number(lastMonth?.total || 0),
        },
        revenueByDay,
        newUsersPerWeek,
        subscriptionStats,
      },
    };
  }
}
