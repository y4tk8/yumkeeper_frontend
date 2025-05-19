import { describe, expect, it } from "vitest";
import { mapItems, mapIngredientsToEntries } from "@/utils/mapItems";
import { Ingredient } from "@/types/ingredient";
import { ItemEntry } from "@/types/recipe";

describe("mapItems", () => {
  it("nameとamountの両方が空の項目は除外される", () => {
    const input: ItemEntry[] = [
      { name: "", amount: "", id: undefined },
      { name: "玉ねぎ", amount: "3個", id: undefined },
    ];

    const result = mapItems(input, "ingredient");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("玉ねぎ");
  });

  it("amountが10gのとき、quantityとunitに分解される", () => {
    const input: ItemEntry[] = [
      { name: "塩", amount: "10g", id: undefined },
    ];

    const result = mapItems(input, "seasoning");
    expect(result[0]).toMatchObject({
      name: "塩",
      quantity: 10,
      unit: "g",
      category: "seasoning",
    });
  });

  it("idがある場合、結果にidが含まれる", () => {
    const input: ItemEntry[] = [
      { name: "砂糖", amount: "15g", id: 3 },
    ];

    const result = mapItems(input, "seasoning");
    expect(result[0].id).toBe(3);
  });

  it("_destroy: true がある場合、結果に _destroy: true が含まれる", () => {
    const input: ItemEntry[] = [
      { name: "醤油", amount: "大さじ1", id: 5, _destroy: true },
    ];

    const result = mapItems(input, "seasoning");
    expect(result[0]._destroy).toBe(true);
  });
});

describe("mapIngredientsToEntries", () => {
  it("指定したカテゴリではない項目は除外される", () => {
    const ingredients: Ingredient[] = [
      { id: 1, name: "にんじん", quantity: 1, unit: "本", category: "ingredient" },
      { id: 2, name: "塩", quantity: 10, unit: "g", category: "seasoning" },
    ];

    const result = mapIngredientsToEntries(ingredients, "ingredient");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("にんじん");
  });

  it("quantityとunitの両方がある場合、amountはそれらを統合した文字列である", () => {
    const ingredients: Ingredient[] = [
      { id: 1, name: "にんにく", quantity: 2, unit: "片", category: "ingredient" },
    ];

    const result = mapIngredientsToEntries(ingredients, "ingredient");
    expect(result[0].amount).toBe("2片");
  });

  it("unitのみがある場合、amountはunitの値になる", () => {
    const ingredients: Ingredient[] = [
      { id: 1, name: "水", quantity: null, unit: "適量", category: "seasoning" },
    ];

    const result = mapIngredientsToEntries(ingredients, "seasoning");
    expect(result[0].amount).toBe("適量");
  });

  it("quantityのみがある場合、amountはquantityの値になる", () => {
    const ingredients: Ingredient[] = [
      { id: 1, name: "卵", quantity: 3, unit: "", category: "ingredient"},
    ];

    const result = mapIngredientsToEntries(ingredients, "ingredient");
    expect(result[0].amount).toBe("3");
  });
});
