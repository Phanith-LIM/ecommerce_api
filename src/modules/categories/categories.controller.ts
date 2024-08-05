import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../util/guards/authentication.guard';
import { AuthorizationGuard } from '../../util/guards/authorization.guard';
import { Roles } from '../../util/common/user-roles.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CurrentUser } from '../../util/decorator/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
