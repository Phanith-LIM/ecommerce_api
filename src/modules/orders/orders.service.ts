import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ShippingEntity } from './entities/shipping.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { OrderStatusEnum } from './enums/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(ShippingEntity)
    private shippingRepository: Repository<ShippingEntity>,
    @InjectRepository(OrdersProductsEntity)
    private ordersProductsRepository: Repository<OrdersProductsEntity>,
    private readonly productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: UserEntity) {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    Object.assign(orderEntity, createOrderDto.orderedProduct);

    orderEntity.shippingAddress = shippingEntity;
    orderEntity.updatedBy = user;
    orderEntity.user = user;
    const orderTbl = await this.orderRepository.save(orderEntity);

    const opEntity: {
      order: OrderEntity;
      product: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProduct.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.orderedProduct[i].id,
      );
      const product_quantity =
        createOrderDto.orderedProduct[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProduct[i].product_unit_price;
      opEntity.push({
        order,
        product,
        product_quantity,
        product_unit_price,
      });
    }

    const op = await this.ordersProductsRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();
    return this.findOne(orderTbl.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id: id },
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    if (
      order.status === OrderStatusEnum.DELIVERED ||
      order.status === OrderStatusEnum.CANCELED
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }
    if (
      order.status === OrderStatusEnum.PROCESSING &&
      updateOrderStatusDto.status != OrderStatusEnum.SHIPPED
    ) {
      throw new BadRequestException(`Delivery before shipped !!!`);
    }
    if (
      updateOrderStatusDto.status === OrderStatusEnum.SHIPPED &&
      order.status === OrderStatusEnum.SHIPPED
    ) {
      return order;
    }
    if (updateOrderStatusDto.status === OrderStatusEnum.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDto.status === OrderStatusEnum.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    if (updateOrderStatusDto.status === OrderStatusEnum.DELIVERED) {
      await this.stockUpdate(order, OrderStatusEnum.DELIVERED);
    }
    return order;
  }

  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order Not Found.');

    if (order.status === OrderStatusEnum.CANCELED) return order;

    order.status = OrderStatusEnum.CANCELED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatusEnum.CANCELED);
    return order;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
