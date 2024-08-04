import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  UserEntity,
  UserService,
  UserSignInDto,
  UserSignUpDto,
} from 'src/modules';
import { AuthenticationGuard, CurrentUser } from 'src/util';

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
    const accessToken = this.userService.accessToken(user);
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
  @UseGuards(AuthenticationGuard)
  @Get('profile/me')
  async getProfile(@CurrentUser() user: UserEntity) {
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
