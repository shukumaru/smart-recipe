import { ApiProperty } from '@nestjs/swagger';

export class GenerateRecipeDto {
  @ApiProperty({
    example: ['鶏肉', '玉ねぎ', '卵'],
    description: '食材のリスト',
    type: [String],
  })
  ingredients: string[];

  @ApiProperty({
    example: 30,
    description: '調理時間（分）',
    type: Number,
    required: false,
  })
  cookingTime?: number;

  @ApiProperty({
    example: 5,
    description: '提案するレシピの数',
    type: Number,
    required: false,
  })
  recipeCount?: number;

  @ApiProperty({
    example: '和食',
    description: '料理のジャンル',
    type: String,
    required: false,
  })
  genre?: string;

  @ApiProperty({
    example: false,
    description: '離乳食のレシピかどうか',
    type: Boolean,
    required: false,
  })
  isBabyFood?: boolean;

  @ApiProperty({
    example: false,
    description: '幼児食（1歳半頃～3歳）のレシピかどうか',
    type: Boolean,
    required: false,
  })
  isToddlerFood?: boolean;

  @ApiProperty({
    example: false,
    description: 'キャンプ飯かどうか',
    type: Boolean,
    required: false,
  })
  isCamping?: boolean;

  @ApiProperty({
    example: 2,
    description: '何人分か',
    type: Number,
    required: false,
  })
  servings?: number;
}
