import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationStrategy } from 'src/util';
import { UserController } from './user.controller';
import { UserEntity } from './entities';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthenticationStrategy, JwtService],
  exports: [UserService],
})
export class UserModule {}
