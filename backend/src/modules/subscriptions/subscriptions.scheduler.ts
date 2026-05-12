import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionStatus } from '../../common/enums/subscription-status.enum';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class SubscriptionsScheduler {
  private readonly logger = new Logger(SubscriptionsScheduler.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly ordersService: OrdersService,
  ) {}

  // ─── Ejecutar todos los días a las 6 AM ─────────────────────
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async processSubscriptions() {
    this.logger.log('🌸 Iniciando procesamiento de suscripciones...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar suscripciones activas con entrega programada para hoy o antes
    const subscriptions = await this.subscriptionRepository.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        nextDeliveryDate: LessThanOrEqual(today),
      },
      relations: ['plan', 'recipient', 'user'],
    });

    this.logger.log(`📦 ${subscriptions.length} suscripciones para procesar`);

    let processed = 0;
    let errors = 0;

    for (const subscription of subscriptions) {
      try {
        // Crear pedido automático
        await this.ordersService.createFromSubscription(subscription);

        // Calcular próxima fecha de entrega
        const { SubscriptionsService } = await import('./subscriptions.service');
        // Calcular manualmente para evitar dependencia circular
        const next = new Date(subscription.nextDeliveryDate);
        next.setDate(next.getDate() + (subscription.plan.intervalDays || 30));

        subscription.nextDeliveryDate = next;
        subscription.lastDeliveryDate = today;
        await this.subscriptionRepository.save(subscription);

        processed++;
        this.logger.log(`✅ Pedido generado para suscripción ${subscription.id}`);
      } catch (error) {
        errors++;
        this.logger.error(
          `❌ Error procesando suscripción ${subscription.id}: ${error.message}`,
        );
      }
    }

    this.logger.log(
      `🎉 Procesamiento completado: ${processed} exitosos, ${errors} errores`,
    );
  }

  // ─── Verificar suscripciones expiradas (diario a medianoche) ─
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    const today = new Date();

    const expired = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .where('sub.status = :status', { status: SubscriptionStatus.ACTIVE })
      .andWhere('sub.end_date IS NOT NULL')
      .andWhere('sub.end_date < :today', { today })
      .getMany();

    for (const sub of expired) {
      sub.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepository.save(sub);
      this.logger.log(`⏰ Suscripción ${sub.id} marcada como expirada`);
    }

    if (expired.length > 0) {
      this.logger.log(`${expired.length} suscripciones marcadas como expiradas`);
    }
  }
}
