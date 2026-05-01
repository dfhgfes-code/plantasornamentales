import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @Column({ name: 'stock', default: 0 })
  stock: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ name: 'sku', length: 50, nullable: true, unique: true })
  sku: string;

  // @OneToMany(() => OrderItem, (item) => item.product)
  // orderItems: OrderItem[];

  // @OneToMany(() => PlanProduct, (pp) => pp.product)
  // planProducts: PlanProduct[];
}
