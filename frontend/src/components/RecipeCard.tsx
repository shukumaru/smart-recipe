import React from 'react';
import { Recipe } from '../types/recipe';

interface Props {
  recipe: Recipe;
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  return (
    <div>
      <h3>{recipe.title}</h3>
      {/* TODO: Implement recipe card details */}
    </div>
  );
};

export default RecipeCard;
