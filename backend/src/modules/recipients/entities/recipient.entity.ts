import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('recipients')
export class Recipient extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100, nullable: true })
  neighborhood: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  // @OneToMany(() => Subscription, (sub) => sub.recipient)
  // subscriptions: Subscription[];
}
