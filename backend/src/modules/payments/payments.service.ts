import {
  Injectable, NotFoundException, BadRequestException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { WompiService } from './wompi.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly wompiService: WompiService,
  ) {}

  // ─── INICIAR PAGO ────────────────────────────────────────────
  async initiatePayment(user: User, dto: CreatePaymentDto) {
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId, userId: user.id },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Este pedido no está disponible para pago');
    }

    // Verificar si ya hay un pago aprobado
    const existingPayment = await this.paymentRepository.findOne({
      where: { orderId: dto.orderId, status: PaymentStatus.APPROVED },
    });
    if (existingPayment) {
      throw new BadRequestException('Este pedido ya fue pagado');
    }

    // Generar referencia única
    const reference = `JAP-${order.orderNumber}-${Date.now()}`;

    // Construir método de pago para Wompi
    const paymentMethodData = this.wompiService.buildPaymentMethod(
      dto.paymentMethod,
      dto.paymentToken,
      dto.paymentMethodInfo,
    );

    // Crear registro de pago pendiente
    const payment = this.paymentRepository.create({
      orderId: order.id,
      userId: user.id,
      wompiReference: reference,
      status: PaymentStatus.PENDING,
      amount: order.total,
      currency: 'COP',
      paymentMethod: dto.paymentMethod,
      paymentMethodInfo: dto.paymentMethodInfo,
    });
    await this.paymentRepository.save(payment);

    // Enviar a Wompi
    try {
      const wompiResponse = await this.wompiService.createTransaction({
        amountInCents: Math.round(Number(order.total) * 100),
        currency: 'COP',
        reference,
        customerEmail: user.email,
        paymentMethod: paymentMethodData,
      });

      const transaction = wompiResponse?.data;

      // Actualizar con datos de Wompi
      payment.wompiTransactionId = transaction?.id;
      payment.wompiStatus = transaction?.status;
      payment.status = this.wompiService.mapWompiStatus(transaction?.status) as PaymentStatus;

      if (payment.status === PaymentStatus.APPROVED) {
        payment.paidAt = new Date();
        await this.orderRepository.update(order.id, { status: OrderStatus.PROCESSING });
      }

      await this.paymentRepository.save(payment);

      return {
        message: 'Pago iniciado correctamente',
        data: {
          payment,
          wompiTransaction: transaction,
          redirectUrl: transaction?.redirect_url,
        },
      };
    } catch (error) {
      payment.status = PaymentStatus.ERROR;
      payment.errorMessage = error?.response?.data?.error?.reason || 'Error al procesar el pago';
      await this.paymentRepository.save(payment);

      throw new BadRequestException(payment.errorMessage);
    }
  }

  // ─── WEBHOOK DE WOMPI ────────────────────────────────────────
  async handleWebhook(payload: any, signature: string) {
    // Verificar firma
    const isValid = this.wompiService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      this.logger.warn('Webhook con firma inválida recibido');
      return { message: 'Firma inválida' };
    }

    const transaction = payload?.data?.transaction;
    if (!transaction) return { message: 'Sin datos de transacción' };

    const payment = await this.paymentRepository.findOne({
      where: { wompiTransactionId: transaction.id },
    });

    if (!payment) {
      // Buscar por referencia
      const paymentByRef = await this.paymentRepository.findOne({
        where: { wompiReference: transaction.reference },
      });
      if (!paymentByRef) {
        this.logger.warn(`Pago no encontrado para transacción: ${transaction.id}`);
        return { message: 'Pago no encontrado' };
      }
    }

    const targetPayment = payment || await this.paymentRepository.findOne({
      where: { wompiReference: transaction.reference },
    });

    const newStatus = this.wompiService.mapWompiStatus(transaction.status) as PaymentStatus;
    targetPayment.status = newStatus;
    targetPayment.wompiTransactionId = transaction.id;
    targetPayment.wompiStatus = transaction.status;
    targetPayment.webhookData = payload;

    if (newStatus === PaymentStatus.APPROVED) {
      targetPayment.paidAt = new Date();
      // Actualizar estado del pedido
      if (targetPayment.orderId) {
        await this.orderRepository.update(
          targetPayment.orderId,
          { status: OrderStatus.PROCESSING },
        );
      }
    }

    await this.paymentRepository.save(targetPayment);
    this.logger.log(`Webhook procesado: ${transaction.id} → ${newStatus}`);

    return { message: 'Webhook procesado correctamente' };
  }

  // ─── CONSULTAR ESTADO ────────────────────────────────────────
  async getPaymentStatus(paymentId: string, userId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId, userId },
      relations: ['order'],
    });
    if (!payment) throw new NotFoundException('Pago no encontrado');

    // Consultar estado actualizado en Wompi si está pendiente
    if (payment.status === PaymentStatus.PENDING && payment.wompiTransactionId) {
      try {
        const wompiData = await this.wompiService.getTransaction(payment.wompiTransactionId);
        const newStatus = this.wompiService.mapWompiStatus(
          wompiData?.data?.status,
        ) as PaymentStatus;

        if (newStatus !== payment.status) {
          payment.status = newStatus;
          payment.wompiStatus = wompiData?.data?.status;
          if (newStatus === PaymentStatus.APPROVED) {
            payment.paidAt = new Date();
            await this.orderRepository.update(payment.orderId, { status: OrderStatus.PROCESSING });
          }
          await this.paymentRepository.save(payment);
        }
      } catch (e) {
        this.logger.warn('No se pudo consultar estado en Wompi');
      }
    }

    return { message: 'Estado del pago obtenido', data: payment };
  }

  // ─── HISTORIAL DE PAGOS ──────────────────────────────────────
  async findMyPayments(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.paymentRepository.findAndCount({
      where: { userId },
      relations: ['order'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      message: 'Pagos obtenidos correctamente',
      data: paginate(data, total, page, limit),
    };
  }

  // ─── ADMIN: todos los pagos ──────────────────────────────────
  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.paymentRepository.findAndCount({
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      message: 'Pagos obtenidos correctamente',
      data: paginate(data, total, page, limit),
    };
  }
}
