import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationGuard } from 'src/util/guards/authentication.guard';
import { CurrentUser } from '../../util/decorator/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from '../../util/guards/authorization.guard';
import { Roles } from '../../util/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: UserEntity) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderStatusDto, @CurrentUser() currentUser: UserEntity) {
    return this.ordersService.update(+id, updateOrderDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @ApiBearerAuth()
  @Put('cancel/:id')
  cancelled(@Param('id') id: string, @CurrentUser() currentUser: UserEntity) {
    return this.ordersService.cancelled(+id, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
