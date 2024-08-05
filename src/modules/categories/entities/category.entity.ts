import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ nullable: true })
  description: string;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
  updateAt: Timestamp;

  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;

  @OneToMany(() => ProductEntity, (prod) => prod.category)
  products: ProductEntity[];
}
