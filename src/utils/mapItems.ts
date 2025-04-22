import { parseAmountToQuantityAndUnit } from "@/utils/parseAmount";
import { ItemEntry } from "@/types/recipe";
import { Ingredient } from "@/types/ingredient";

// 材料・調味料の入力値 -> API送信用へ map で整形
export const mapItems = (
  items: ItemEntry[],
  category: "ingredient" | "seasoning",
  includeId = false,
): Ingredient[] => {
  return items
    .filter((item) => item.name.trim() !== "" || item.amount.trim() !== "") // name と amount どちらも空の行は除外
    .map((item) => {
      const { quantity, unit } = parseAmountToQuantityAndUnit(item.amount);
      const base = {
        name: item.name,
        quantity,
        unit,
        category,
      };

      return includeId && item.id ? { ...base, id: item.id } : base; // 新規登録ではID不要。更新ではカラム識別のためID付与。
    });
};

// APIからの取得値 -> 画面表示用へ map で整形
export const mapIngredientsToEntries = (ingredients: Ingredient[], category: "ingredient" | "seasoning"): ItemEntry[] => {
  return ingredients
    .filter((item) => item.category === category)
    .map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.quantity !== null && item.unit !== null
        ? `${item.quantity}${item.unit}`
        : item.quantity !== null
        ? `${item.quantity}`
        : item.unit || "",
    }));
};
