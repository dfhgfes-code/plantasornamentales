import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { User } from '../../users/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Recipient } from '../../recipients/entities/recipient.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'subscription_id', nullable: true })
  subscriptionId: string;

  @ManyToOne(() => Subscription, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ name: 'recipient_id', nullable: true })
  recipientId: string;

  @ManyToOne(() => Recipient, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Recipient;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'delivery_address', type: 'text', nullable: true })
  deliveryAddress: string;

  @Column({ name: 'delivery_city', length: 100, nullable: true })
  deliveryCity: string;

  @Column({ name: 'sender_name', length: 100, nullable: true })
  senderName: string;

  @Column({ name: 'sender_phone', length: 20, nullable: true })
  senderPhone: string;

  @Column({ name: 'receiver_name', length: 100, nullable: true })
  receiverName: string;

  @Column({ name: 'receiver_phone', length: 20, nullable: true })
  receiverPhone: string;

  @Column({ name: 'scheduled_date', type: 'date', nullable: true })
  scheduledDate: Date;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt: Date;

  @Column({ name: 'is_automatic', default: false })
  isAutomatic: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
