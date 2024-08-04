import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

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
