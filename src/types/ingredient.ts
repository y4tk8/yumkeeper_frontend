export interface Ingredient {
  id?: number;
  name: string;
  quantity: number | null;
  unit: string;
  category: "ingredient" | "seasoning";
}
