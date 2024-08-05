import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', required: false, default: null })
  @IsOptional()
  description?: string = null;
}
