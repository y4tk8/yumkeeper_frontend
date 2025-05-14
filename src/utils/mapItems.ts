import { parseAmountToQuantityAndUnit } from "@/utils/parseAmount";
import { Ingredient } from "@/types/ingredient";
import { ItemEntry } from "@/types/recipe";

// 材料・調味料の入力値 -> API送信用へ map で整形
export const mapItems = (
  items: ItemEntry[],
  category: "ingredient" | "seasoning",
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

      const withId = typeof item.id === "number" ? { ...base, id: item.id } : base; // 更新ではレコード識別のためID付与。新規追加ではID不要。

      return item._destroy ? { ...withId, _destroy: true } : withId;
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
