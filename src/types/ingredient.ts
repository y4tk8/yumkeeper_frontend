export interface Ingredient {
  id?: number | string;
  name: string;
  quantity: number | null;
  unit: string;
  category: "ingredient" | "seasoning";
}
