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

  // Galería de imágenes adicionales (JSON array de URLs)
  @Column({ name: 'images', type: 'text', nullable: true })
  images: string;

  // Complementos/adicionales (JSON array de {name, price, imageUrl})
  @Column({ name: 'additionals', type: 'text', nullable: true })
  additionals: string;

  @Column({ name: 'stock', default: 0 })
  stock: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ name: 'sku', length: 50, nullable: true, unique: true })
  sku: string;

  @Column({ type: 'float', default: 5.0 })
  rating: number;

  @Column({ name: 'reviews_count', default: 0 })
  reviewsCount: number;
}
