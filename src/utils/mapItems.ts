import { parseAmountToQuantityAndUnit } from "./parseAmount";
import { ItemEntry } from "@/types/recipe";

// 材料 or 調味料 の入力値を map で処理
export const mapItems = (items: ItemEntry[], category: "ingredient" | "seasoning") => {
  return items
  .filter((item) => item.name.trim() !== "" || item.amount.trim() !== "") // name と amount どちらも空の行は除外
  .map((item) => {
    const { quantity, unit } = parseAmountToQuantityAndUnit(item.amount);
    return {
      name: item.name,
      quantity,
      unit,
      category,
    };
  });
};
