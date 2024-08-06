import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { ShippingEntity } from './shipping.entity';
import { OrdersProductsEntity } from './orders-products.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderAt: Timestamp;

  @Column({ type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.PROCESSING })
  status: OrderStatusEnum;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.ordersUpdatedBy)
  updatedBy: UserEntity;

  @OneToOne(() => ShippingEntity, (shipping) => shipping.order, {cascade: true})
  @JoinColumn()
  shippingAddress: ShippingEntity;

  @OneToMany(() => OrdersProductsEntity, (op) => op.order, { cascade: true })
  products: OrdersProductsEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;
}
