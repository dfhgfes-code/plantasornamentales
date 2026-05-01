import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Recipient } from '../recipients/entities/recipient.entity';
import { User } from '../users/entities/user.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { SubscriptionStatus } from '../../common/enums/subscription-status.enum';
import { PlanFrequency } from '../../common/enums/plan-frequency.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Recipient)
    private readonly recipientRepository: Repository<Recipient>,
  ) {}

  // ─── CREAR SUSCRIPCIÓN ───────────────────────────────────────
  async create(userId: string, dto: CreateSubscriptionDto) {
    // Validar plan activo
    const plan = await this.planRepository.findOne({
      where: { id: dto.planId, isActive: true },
    });
    if (!plan) throw new NotFoundException('Plan no encontrado o inactivo');

    // Validar destinatario del usuario
    const recipient = await this.recipientRepository.findOne({
      where: { id: dto.recipientId, userId },
    });
    if (!recipient) throw new NotFoundException('Destinatario no encontrado');

    // Calcular próxima fecha de entrega
    const startDate = new Date(dto.startDate);
    const nextDeliveryDate = this.calculateNextDelivery(startDate, plan.frequency);

    const subscription = this.subscriptionRepository.create({
      userId,
      planId: dto.planId,
      recipientId: dto.recipientId,
      startDate,
      nextDeliveryDate,
      status: SubscriptionStatus.ACTIVE,
      notes: dto.notes,
    });

    await this.subscriptionRepository.save(subscription);

    // Cargar relaciones para la respuesta
    const full = await this.subscriptionRepository.findOne({
      where: { id: subscription.id },
      relations: ['plan', 'recipient'],
    });

    return { message: 'Suscripción creada exitosamente', data: full };
  }

  // ─── MIS SUSCRIPCIONES ───────────────────────────────────────
  async findMySubscriptions(userId: string) {
    const subscriptions = await this.subscriptionRepository.find({
      where: { userId },
      relations: ['plan', 'recipient'],
      order: { createdAt: 'DESC' },
    });
    return { message: 'Suscripciones obtenidas correctamente', data: subscriptions };
  }

  // ─── ADMIN: todas las suscripciones ─────────────────────────
  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.subscriptionRepository.findAndCount({
      relations: ['plan', 'recipient', 'user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      message: 'Suscripciones obtenidas correctamente',
      data: paginate(data, total, page, limit),
    };
  }

  // ─── OBTENER UNA ─────────────────────────────────────────────
  async findOne(id: string, requestingUser: User) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['plan', 'recipient', 'user'],
    });
    if (!subscription) throw new NotFoundException('Suscripción no encontrada');
    this.checkOwnership(subscription, requestingUser);
    return { message: 'Suscripción encontrada', data: subscription };
  }

  // ─── ACTUALIZAR ──────────────────────────────────────────────
  async update(id: string, dto: UpdateSubscriptionDto, requestingUser: User) {
    const subscription = await this.subscriptionRepository.findOne({ where: { id } });
    if (!subscription) throw new NotFoundException('Suscripción no encontrada');
    this.checkOwnership(subscription, requestingUser);

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('No se puede modificar una suscripción cancelada');
    }

    if (dto.recipientId) {
      const recipient = await this.recipientRepository.findOne({
        where: { id: dto.recipientId, userId: subscription.userId },
      });
      if (!recipient) throw new NotFoundException('Destinatario no encontrado');
    }

    Object.assign(subscription, dto);
    await this.subscriptionRepository.save(subscription);

    const full = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['plan', 'recipient'],
    });
    return { message: 'Suscripción actualizada correctamente', data: full };
  }

  // ─── PAUSAR ──────────────────────────────────────────────────
  async pause(id: string, requestingUser: User) {
    const subscription = await this.subscriptionRepository.findOne({ where: { id } });
    if (!subscription) throw new NotFoundException('Suscripción no encontrada');
    this.checkOwnership(subscription, requestingUser);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Solo se pueden pausar suscripciones activas');
    }

    subscription.status = SubscriptionStatus.PAUSED;
    await this.subscriptionRepository.save(subscription);
    return { message: 'Suscripción pausada correctamente', data: subscription };
  }

  // ─── REACTIVAR ───────────────────────────────────────────────
  async resume(id: string, requestingUser: User) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['plan'],
    });
    if (!subscription) throw new NotFoundException('Suscripción no encontrada');
    this.checkOwnership(subscription, requestingUser);

    if (subscription.status !== SubscriptionStatus.PAUSED) {
      throw new BadRequestException('Solo se pueden reactivar suscripciones pausadas');
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    // Recalcular próxima entrega desde hoy
    subscription.nextDeliveryDate = this.calculateNextDelivery(
      new Date(),
      subscription.plan.frequency,
    );
    await this.subscriptionRepository.save(subscription);
    return { message: 'Suscripción reactivada correctamente', data: subscription };
  }

  // ─── CANCELAR ────────────────────────────────────────────────
  async cancel(id: string, dto: CancelSubscriptionDto, requestingUser: User) {
    const subscription = await this.subscriptionRepository.findOne({ where: { id } });
    if (!subscription) throw new NotFoundException('Suscripción no encontrada');
    this.checkOwnership(subscription, requestingUser);

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('La suscripción ya está cancelada');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.cancelReason = dto.reason;
    await this.subscriptionRepository.save(subscription);
    return { message: 'Suscripción cancelada correctamente', data: subscription };
  }

  // ─── HELPERS ─────────────────────────────────────────────────
  calculateNextDelivery(from: Date, frequency: PlanFrequency): Date {
    const next = new Date(from);
    if (frequency === PlanFrequency.WEEKLY) {
      next.setDate(next.getDate() + 7);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    return next;
  }

  private checkOwnership(subscription: Subscription, user: User) {
    if (subscription.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes acceso a esta suscripción');
    }
  }
}
