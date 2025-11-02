import type { Recipe } from "../types/recipe";

const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "/api";

export interface GenerateRecipeOptions {
  ingredients: string[];
  cookingTime?: number;
  recipeCount?: number;
  genre?: string;
  forKids?: boolean;
  isCamping?: boolean;
  servings?: number;
}

export const createApiClient = (idToken: string | null) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
  }

  const generateRecipes = async (
    options: GenerateRecipeOptions
  ): Promise<Recipe[]> => {
    const response = await fetch(`${API_URL}/recipe/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      // For 401/403 errors, the response might not be JSON.
      if (response.status === 401 || response.status === 403) {
        throw new Error("認証エラーが発生しました。再度ログインしてください。");
      }
      const errorData = await response.json().catch(() => ({ message: 'レシピの生成に失敗しました。' }));
      throw new Error(errorData.message || "レシピの生成に失敗しました。");
    }

    return response.json();
  };

  return { generateRecipes };
};
