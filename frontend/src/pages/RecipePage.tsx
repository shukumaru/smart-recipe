import React, { useState, useMemo } from "react";
import type { Recipe } from "../types/recipe";
import { createApiClient } from "../services/api";
import styles from "./RecipePage.module.css";
import {
  ingredientSuggestions,
  servingsOptions,
  cookingTimeOptions,
  recipeCountOptions,
  genreOptions,
} from "../constants";

// Props for RecipePage, including the idToken
interface RecipePageProps {
  idToken: string | null;
}

// Modal Component for Recipe Detail
const RecipeDetailModal: React.FC<{
  recipe: Recipe | null;
  onClose: () => void;
}> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>{recipe.title}</h2>
        <p>
          <strong>調理時間:</strong> {recipe.time}分
        </p>
        <div>
          <strong>材料:</strong>
          <ul>
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                {ing.name} ({ing.quantity})
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>作り方:</strong>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const RecipePage: React.FC<RecipePageProps> = ({ idToken }) => {
  const [ingredientInputs, setIngredientInputs] = useState<string[]>(
    Array(3).fill("")
  );
  const [ingredientErrors, setIngredientErrors] = useState<string[]>(
    Array(3).fill("")
  );
  const [commaIngredients, setCommaIngredients] = useState("");

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for additional options
  const [cookingTime, setCookingTime] = useState<number>(30);
  const [recipeCount, setRecipeCount] = useState<number>(3);
  const [genre, setGenre] = useState<string>("none");
  const [isBabyFood, setIsBabyFood] = useState<boolean>(false);
  const [isToddlerFood, setIsToddlerFood] = useState<boolean>(false);
  const [isCamping, setIsCamping] = useState<boolean>(false);
  const [servings, setServings] = useState<number>(2);

  const handleIngredientInputChange = (index: number, value: string) => {
    const newInputs = [...ingredientInputs];
    newInputs[index] = value;
    setIngredientInputs(newInputs);

    const newErrors = [...ingredientErrors];
    if (value && !ingredientSuggestions.includes(value)) {
      newErrors[index] = "候補にありません";
    } else {
      newErrors[index] = "";
    }
    setIngredientErrors(newErrors);
  };

  const allIngredients = useMemo(() => {
    const ingredientsFromInputs = ingredientInputs.filter(
      (ing, index) => ing.trim() !== "" && !ingredientErrors[index]
    );
    const ingredientsFromComma = commaIngredients
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing !== "");
    return [...new Set([...ingredientsFromInputs, ...ingredientsFromComma])];
  }, [ingredientInputs, commaIngredients, ingredientErrors]);

  const handleSuggestionClick = async () => {
    if (!idToken) {
      setError("Googleアカウントでログインしてください。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    if (allIngredients.length === 0) {
      setError("有効な材料を1つ以上入力してください。");
      setIsLoading(false);
      return;
    }

    try {
      const apiClient = createApiClient(idToken);
      const options = {
        ingredients: allIngredients,
        cookingTime,
        recipeCount,
        genre,
        isBabyFood,
        isToddlerFood,
        isCamping,
        servings,
      };
      const result = await apiClient.generateRecipes(options);
      setRecipes(result);
    } catch (err: any) {
      setError(err.message || "不明なエラーが発生しました。");
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const getButtonState = () => {
    if (!idToken) {
      return { disabled: true, text: "ログインしてください" };
    }
    if (isLoading) {
      return { disabled: true, text: "AIが考え中..." };
    }
    if (allIngredients.length === 0) {
      return { disabled: true, text: "材料を入力してください" };
    }
    return { disabled: false, text: "AIに献立を提案してもらう" };
  };

  const buttonState = getButtonState();

  return (
    <div className={styles.container}>
      <datalist id="ingredient-suggestions">
        {ingredientSuggestions.map((ing) => (
          <option key={ing} value={ing} />
        ))}
      </datalist>

      <h1 className={styles.title}>レシピサポートくん</h1>
      <img
        src="/top_picture.png"
        alt="top picture"
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "15px auto",
          marginTop: "-40px",
          display: "block",
        }}
      />
      <p className={styles.subtitle}>
        冷蔵庫にある材料を入れるとAIが料理の献立を提案してくれるよ
      </p>
      <div className={styles.inputSection}>
        <h2>冷蔵庫にあるもの</h2>
        <div className={styles.ingredientInputs}>
          {ingredientInputs.map((ing, index) => (
            <div key={index} className={styles.inputWrapper}>
              <input
                type="text"
                list="ingredient-suggestions"
                className={styles.inputField}
                placeholder={`材料 ${index + 1}`}
                value={ing}
                onChange={(e) =>
                  handleIngredientInputChange(index, e.target.value)
                }
              />
              {ingredientErrors[index] && (
                <p className={styles.errorText}>{ingredientErrors[index]}</p>
              )}
            </div>
          ))}
        </div>
        <textarea
          className={styles.textareaField}
          placeholder="または、カンマ区切りで入力 (例: 鶏肉, たまねぎ, ごはん)"
          value={commaIngredients}
          onChange={(e) => setCommaIngredients(e.target.value)}
          maxLength={20}
        />
      </div>

      <div className={styles.optionsSection}>
        <h2>オプション</h2>
        <div className={styles.optionRow}>
          <div className={styles.optionItem}>
            <label>人数:</label>
            <select
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            >
              {servingsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.optionItem}>
            <label>調理時間:</label>
            <select
              value={cookingTime}
              onChange={(e) => setCookingTime(Number(e.target.value))}
            >
              {cookingTimeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.optionItem}>
            <label>提案数:</label>
            <select
              value={recipeCount}
              onChange={(e) => setRecipeCount(Number(e.target.value))}
            >
              {recipeCountOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.optionRow}>
          <div className={styles.optionItem}>
            <label>ジャンル:</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              {genreOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.optionItem}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={isBabyFood}
                onChange={(e) => {
                  setIsBabyFood(e.target.checked);
                  if (e.target.checked) {
                    setIsToddlerFood(false);
                  }
                }}
                disabled={isToddlerFood}
              />
              離乳食
              <span className={styles.hint} tabIndex={0} aria-hidden>
                ℹ
                <span className={styles.hintText} role="tooltip">
                  離乳食（初期～完了期）を提案するよ
                </span>
              </span>
            </label>
          </div>
          <div className={styles.optionItem}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={isToddlerFood}
                onChange={(e) => {
                  setIsToddlerFood(e.target.checked);
                  if (e.target.checked) {
                    setIsBabyFood(false);
                  }
                }}
                disabled={isBabyFood}
              />
              幼児食
              <span className={styles.hint} tabIndex={0} aria-hidden>
                ℹ
                <span className={styles.hintText} role="tooltip">
                  小さい子供（1歳半～3歳向け）のご飯を提案するよ
                </span>
              </span>
            </label>
          </div>
          <div className={styles.optionItem}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={isCamping}
                onChange={(e) => setIsCamping(e.target.checked)}
              />
              キャンプ飯
              <span className={styles.hint} tabIndex={0} aria-hidden>
                ℹ
                <span className={styles.hintText} role="tooltip">
                  キャンプで作れるような料理を提案するよ
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <button
        className={styles.button}
        onClick={handleSuggestionClick}
        disabled={buttonState.disabled}
      >
        {buttonState.text}
      </button>

      <div className={styles.resultsSection}>
        <h2>提案された献立</h2>
        {isLoading && <div className={styles.loader}></div>}
        {error && !isLoading && <p className={styles.error}>{error}</p>}
        {!isLoading && !error && recipes.length === 0 && (
          <p>まだ提案はありません。材料を入力してボタンを押してください。</p>
        )}
        <div className={styles.recipeGrid}>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className={styles.recipeCard}
              onClick={() => handleRecipeClick(recipe)}
            >
              <h3>{recipe.title}</h3>
              <p>
                <strong>調理時間:</strong> {recipe.time}分
              </p>
              <p>
                <strong>材料:</strong>{" "}
                {recipe.ingredients
                  .map((i) => `${i.name}(${i.quantity})`)
                  .join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <RecipeDetailModal recipe={selectedRecipe} onClose={closeModal} />
    </div>
  );
};

export default RecipePage;
