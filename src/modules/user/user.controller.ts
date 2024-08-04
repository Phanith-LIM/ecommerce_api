import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from '../../util/decorator/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { AuthenticationGuard } from '../../util/guards/authentication.guard';
import { AuthorizeGuard } from '../../util/guards/authorization.guard';
import { Roles } from '../../util/common/user-roles.enum';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  signUp(@Body() signupDto: UserSignUpDto) {
    return this.userService.signUp(signupDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: UserSignInDto) {
    const user = await this.userService.signIn(signInDto);
    const accessToken = await this.userService.accessToken(user);
    return { accessToken, user };
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('profile/me')
  async getProfile(@CurrentUser() user: UserEntity) {
    console.log(user);
    return user;
  }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
