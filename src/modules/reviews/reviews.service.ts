import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewsRepository: Repository<ReviewEntity>,
    private readonly productService: ProductsService,
  ) {}
  async create(createReviewDto: CreateReviewDto, user: UserEntity) {
    const product = await this.productService.findOne(
      +createReviewDto.productId,
    );
    let review = await this.findOneByUserAndProductId(user.id, product.id);
    if (!review) {
      review = this.reviewsRepository.create(createReviewDto);
      review.user = user;
      review.product = product;
    }
    return await this.reviewsRepository.save(review);
  }

  async findAll() {
    return this.reviewsRepository.find();
  }

  async findAllByProductId(productId: number) {
    await this.productService.findOne(productId);
    return await this.reviewsRepository.find({
      where: {
        product: { id: productId },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
        },
      },
    });
    if (!review) {
      throw new NotFoundException();
    }
    return review;
  }

  async findOneByUser(id: number, user: UserEntity) {
    const review = await this.reviewsRepository.findOne({
      where: { id: id, user: { id: user.id } },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
        },
      },
    });
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found for user`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, user: UserEntity) {
    const review = await this.findOneByUser(id, user);
    Object.assign(review, updateReviewDto);
    if (updateReviewDto.productId) {
      review.product = await this.productService.findOne(
        +updateReviewDto.productId,
      );
    }
    return await this.reviewsRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    if (!review) {
      throw new NotFoundException();
    }
    return await this.reviewsRepository.remove(review);
  }

  async findOneByUserAndProductId(userId: number, productId: number) {
    return await this.reviewsRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }
}
