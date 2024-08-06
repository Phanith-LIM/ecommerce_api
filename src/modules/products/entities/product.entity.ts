import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ReviewEntity } from '../../reviews/entities/review.entity';
import { OrdersProductsEntity } from '../../orders/entities/orders-products.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  stock: number;

  @Column('simple-array')
  image: string[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => UserEntity, (user) => user.products)
  addedBy: UserEntity;

  @ManyToOne(() => CategoryEntity, (cat) => cat.products)
  category: CategoryEntity;

  @OneToMany(() => ReviewEntity, (rev) => rev.product)
  reviews: ReviewEntity[];

  @OneToMany(() => OrdersProductsEntity, (op) => op.product)
  products: OrdersProductsEntity[];
}
