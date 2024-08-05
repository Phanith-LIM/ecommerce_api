import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ratings: number;

  @ApiProperty()
  @IsNotEmpty()
  comments: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
