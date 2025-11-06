import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Genre } from './genre.enum';

export class GenerateRecipeDto {
  @ApiProperty({
    example: ['鶏肉', '玉ねぎ', '卵'],
    description: '食材のリスト',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @MaxLength(10, { each: true, message: '食材は10文字以内で入力してください。' })
  ingredients: string[];

  @ApiProperty({
    example: 30,
    description: '調理時間（分）',
    type: Number,
    required: true,
  })
  @IsInt()
  @IsIn([15, 30, 60, 90, 120])
  cookingTime: number;

  @ApiProperty({
    example: 5,
    description: '提案するレシピの数',
    type: Number,
    required: true,
  })
  @IsInt()
  @IsIn([1, 3, 5])
  recipeCount: number;

  @ApiProperty({
    example: Genre.JAPANESE,
    description: '料理のジャンル',
    enum: Genre,
    required: false,
  })
  @IsOptional()
  @IsEnum(Genre)
  genre?: Genre;

  @ApiProperty({
    example: false,
    description: '離乳食のレシピかどうか',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isBabyFood?: boolean;

  @ApiProperty({
    example: false,
    description: '幼児食（1歳半頃～3歳）のレシピかどうか',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isToddlerFood?: boolean;

  @ApiProperty({
    example: false,
    description: 'キャンプ飯かどうか',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCamping?: boolean;

  @ApiProperty({
    example: 2,
    description: '何人分か',
    type: Number,
    required: true,
  })
  @IsInt()
  @IsIn([1, 2, 3, 4])
  servings: number;
}
