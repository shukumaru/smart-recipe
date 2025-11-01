import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('recipe')
@Controller('recipe')
export class RecipeController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('generate')
  @ApiOperation({ summary: 'AIでレシピを生成する' })
  @ApiResponse({ status: 201, description: '生成されたレシピ（詳細含む）の配列を返します。' })
  @ApiResponse({ status: 400, description: '無効な食材の組み合わせ' })
  @ApiResponse({ status: 500, description: 'サーバーエラー' })
  async generateRecipes(@Body() generateRecipeDto: GenerateRecipeDto) {
    const isValid = await this.geminiService.validateIngredients(
      generateRecipeDto.ingredients,
    );
    if (!isValid) {
      throw new BadRequestException(
        '存在しない、または食べられない組み合わせのようです。材料を確認してください。',
      );
    }
    return this.geminiService.generateRecipes(generateRecipeDto);
  }
}
