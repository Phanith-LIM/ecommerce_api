import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserSignInDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'email must be not empty.' })
  @IsEmail({}, { message: 'email invalid format' })
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password must be empty.' })
  @IsStrongPassword()
  @IsString()
  password: string;
}
