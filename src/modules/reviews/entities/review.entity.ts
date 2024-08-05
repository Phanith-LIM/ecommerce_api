import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ratings: number;

  @Column()
  comments: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (prod) => prod.reviews)
  product: ProductEntity;
}
