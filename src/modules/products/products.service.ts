import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
  ) {}
  async create(createProductDto: CreateProductDto, user: UserEntity) {
    const category = await this.categoryService.findOne(
      +createProductDto.categoryId,
    );
    const prod = this.productRepository.create(createProductDto);
    prod.addedBy = user;
    prod.category = category;
    return await this.productRepository.save(prod);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        category: true,
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          name: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const prod = await this.findOne(id);
    Object.assign(prod, updateProductDto);
    if (updateProductDto.categoryId) {
      prod.category = await this.categoryService.findOne(
        +updateProductDto.categoryId,
      );
    }
    return await this.productRepository.save(prod);
  }
}
