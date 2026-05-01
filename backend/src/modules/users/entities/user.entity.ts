import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 255 })
  @Exclude()
  password: string;

  @Column({ name: 'phone', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @Column({ name: 'city', length: 100, nullable: true })
  city: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  // Relaciones (se completan en fases siguientes)
  // @OneToMany(() => Subscription, (sub) => sub.user)
  // subscriptions: Subscription[];

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];

  // @OneToMany(() => Recipient, (recipient) => recipient.user)
  // recipients: Recipient[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
