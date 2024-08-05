import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: UserEntity,
  ): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    category.addedBy = user;
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: { id: id },
      relations: { addedBy: true },
      select: {
        addedBy: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(id: number, field: Partial<UpdateCategoryDto>) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    Object.assign(category, field);
    return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
