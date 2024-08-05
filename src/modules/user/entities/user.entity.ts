import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from 'src/util/common/user-roles.enum';
import { CategoryEntity } from 'src/modules/categories/entities/category.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { ReviewEntity } from 'src/modules/reviews/entities/review.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false, nullable: false })
  password: string;
  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  role: Roles;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => CategoryEntity, (cat) => cat.addedBy)
  categories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ReviewEntity, (rev) => rev.user)
  reviews: ReviewEntity[];
}
