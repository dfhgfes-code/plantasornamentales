import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PlanFrequency } from '../../../common/enums/plan-frequency.enum';

@Entity('plans')
export class Plan extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: PlanFrequency,
    default: PlanFrequency.MONTHLY,
  })
  frequency: PlanFrequency;

  @Column({ name: 'delivery_count', default: 1 })
  deliveryCount: number; // Cuántas entregas incluye el plan

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  features: string[]; // Lista de características del plan

  // @OneToMany(() => Subscription, (sub) => sub.plan)
  // subscriptions: Subscription[];
}
