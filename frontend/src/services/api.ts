import type { Recipe } from "../types/recipe";

const API_URL = "http://localhost:3000";

export interface GenerateRecipeOptions {
  ingredients: string[];
  cookingTime?: number;
  recipeCount?: number;
  genre?: string;
  forKids?: boolean;
  isCamping?: boolean;
  servings?: number;
}

export const generateRecipes = async (
  options: GenerateRecipeOptions
): Promise<Recipe[]> => {
  const response = await fetch(`${API_URL}/recipe/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "レシピの生成に失敗しました。");
  }

  return response.json();
};
