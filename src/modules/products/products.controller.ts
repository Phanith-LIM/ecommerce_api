import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards, Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from '../../util/decorator/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../util/guards/authentication.guard';
import { AuthorizationGuard } from '../../util/guards/authorization.guard';
import { Roles } from '../../util/common/user-roles.enum';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query() query: any) {
    return await this.productsService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }
}
