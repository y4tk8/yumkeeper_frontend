import { parseAmountToQuantityAndUnit } from "@/utils/parseAmount";
import { ItemEntry } from "@/types/recipe";
import { Ingredient } from "@/types/ingredient";

// 材料・調味料の入力値 -> API送信用へ map で整形
export const mapItems = (items: ItemEntry[], category: "ingredient" | "seasoning"): Ingredient[] => {
  return items
    .filter((item) => item.name.trim() !== "" || item.amount.trim() !== "") // name と amount どちらも空の行は除外
    .map((item) => {
      const { quantity, unit } = parseAmountToQuantityAndUnit(item.amount);
      return {
        name: item.name,
        quantity,
        unit,
        category,
        id: 0, // 新規のレシピ登録ではid不要のため 0 で対応
      };
    });
};

// APIからの取得値 -> 画面表示用へ map で整形
export const mapIngredientsToEntries = (ingredients: Ingredient[], category: "ingredient" | "seasoning"): ItemEntry[] => {
  return ingredients
    .filter((item) => item.category === category)
    .map((item) => ({
      name: item.name,
      amount: item.quantity !== null ? `${item.quantity}${item.unit}` : "",
    }));
};
