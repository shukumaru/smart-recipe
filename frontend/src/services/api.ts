import axios from 'axios';
import type { Recipe, RecipeGenerationOptions } from '../types/recipe';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// This function now doesn't need the token, but we keep the structure
// in case we need other client-specific configurations later.
export const createApiClient = () => {
  const instance = axios.create({
    baseURL,
    withCredentials: true, // This is crucial for sending cookies
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || error.message;
      return Promise.reject(new Error(message));
    },
  );

  return {
    generateRecipes: async (
      options: RecipeGenerationOptions,
    ): Promise<Recipe[]> => {
      const response = await instance.post('/recipe/generate', options);
      return response.data;
    },
    // Add other API methods here
  };
};
