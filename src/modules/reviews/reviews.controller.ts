import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/util/decorator/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { AuthenticationGuard } from 'src/util/guards/authentication.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../util/common/user-roles.enum';
import { AuthorizationGuard } from '../../util/guards/authorization.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get('/all')
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
      },
    },
  })
  @Post('/by-product')
  findAllByProduct(@Body('productId') productId: string) {
    return this.reviewsService.findAllByProductId(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @CurrentUser() currentUser: UserEntity) {
    return this.reviewsService.update(+id, updateReviewDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
