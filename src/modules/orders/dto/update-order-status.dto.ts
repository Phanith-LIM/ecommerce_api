import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatusEnum } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatusEnum.SHIPPED, OrderStatusEnum.DELIVERED])
  status: OrderStatusEnum;
}