export type Ingredient = {
  name: string;
  quantity: string;
};

export type Recipe = {
  id: string; // 一意のID
  title: string; // 献立名
  ingredients: Ingredient[]; // 必要な材料のリスト
  steps: string[]; // 手順のリスト
  time: number; // 調理時間（分）
};
