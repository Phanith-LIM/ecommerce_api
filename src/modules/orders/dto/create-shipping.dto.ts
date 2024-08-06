import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;
}