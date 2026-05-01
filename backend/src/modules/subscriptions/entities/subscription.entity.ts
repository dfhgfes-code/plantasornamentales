import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SubscriptionStatus } from '../../../common/enums/subscription-status.enum';
import { User } from '../../users/entities/user.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { Recipient } from '../../recipients/entities/recipient.entity';

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'plan_id' })
  planId: string;

  @ManyToOne(() => Plan, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ name: 'recipient_id' })
  recipientId: string;

  @ManyToOne(() => Recipient, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Recipient;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'next_delivery_date', type: 'date', nullable: true })
  nextDeliveryDate: Date;

  @Column({ name: 'last_delivery_date', type: 'date', nullable: true })
  lastDeliveryDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string;

  // @OneToMany(() => Order, (order) => order.subscription)
  // orders: Order[];
}
