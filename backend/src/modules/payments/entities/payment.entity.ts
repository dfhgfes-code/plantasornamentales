import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ name: 'order_id', nullable: true })
  orderId: string;

  @ManyToOne(() => Order, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Datos de Wompi
  @Column({ name: 'wompi_transaction_id', nullable: true, unique: true })
  wompiTransactionId: string;

  @Column({ name: 'wompi_reference', unique: true })
  wompiReference: string; // Referencia única que enviamos a Wompi

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'COP' })
  currency: string;

  @Column({ name: 'payment_method', length: 50, nullable: true })
  paymentMethod: string; // PSE, CARD, NEQUI, etc.

  @Column({ name: 'payment_method_info', type: 'jsonb', nullable: true })
  paymentMethodInfo: Record<string, any>; // Últimos 4 dígitos, banco, etc.

  @Column({ name: 'wompi_status', length: 50, nullable: true })
  wompiStatus: string; // Estado raw de Wompi

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @Column({ name: 'webhook_data', type: 'jsonb', nullable: true })
  webhookData: Record<string, any>; // Payload completo del webhook
}
