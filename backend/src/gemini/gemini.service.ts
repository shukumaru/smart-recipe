import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the configuration');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateRecipes(options: {
    ingredients: string[];
    cookingTime?: number;
    recipeCount?: number;
    genre?: string;
    forKids?: boolean;
    isCamping?: boolean;
    servings?: number;
  }): Promise<any> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });

    const {
      ingredients,
      cookingTime = 30,
      recipeCount = 5,
      genre = '指定なし',
      forKids = false,
      isCamping = false,
      servings = 2,
    } = options;

    let prompt = `
      以下の条件に合うレシピを${recipeCount}個提案してください。
      回答はJSON形式で、以下のプロパティを含むオブジェクトの配列としてください。
      - id: string (一意のID、UUID形式)
      - title: string (レシピ名（何人分）)
      - ingredients: { name: string; quantity: string }[] (必要な材料と分量のリスト)
      - time: number (調理時間、分単位)
      - steps: string[] (作り方の手順をステップバイステップで)

      条件:
      - 材料: ${ingredients.join(', ')}
      - 調理時間: ${cookingTime}分以内
      - ジャンル: ${genre}
      - 分量: ${servings}人分
    `;

    if (forKids) {
      prompt += `
        - 子供向け（1歳半頃）の離乳食完了期の食事にしてください。味付けは薄めで、食材は小さく刻んでください。
      `;
    }

    if (isCamping) {
      prompt += `
        - キャンプで簡単に作れる料理にしてください。特別な調理器具は不要なものが望ましいです。
      `;
    }

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      return JSON.parse(text);
    } catch (error) {
      console.error('Error generating recipes:', error);
      throw new Error('AIからのレシピ生成に失敗しました。');
    }
  }

  async validateIngredients(ingredients: string[]): Promise<boolean> {
    if (ingredients.length === 0) {
      return true; // No ingredients to validate
    }
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });
    const prompt = `
      以下の材料の組み合わせが、現実世界の料理として意味をなすかどうかを判断してください。
      明らかに食べられないもの（例: 石、土）や、現実的でない組み合わせの場合に「無効」とだけ答えてください。
      それ以外の場合は「有効」とだけ答えてください。

      材料: ${ingredients.join(', ')}
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();
      return text.includes('有効');
    } catch (error) {
      console.error('Error validating ingredients:', error);
      // In case of validation error, proceed with recipe generation
      return true;
    }
  }
}
