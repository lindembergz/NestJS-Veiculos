import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';

@Entity('Products')
export class Product extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({ length: 100 })
  brand: string;

  @Column({ length: 100 })
  model: string;

  @Column()
  year: number;

  @Column({ length: 50 })
  color: string;

  @Column()
  mileage: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
