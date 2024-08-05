import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ type: 'array', nullable: true, default: [] })
  @IsNotEmpty()
  @IsOptional()
  @IsArray()
  image: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
