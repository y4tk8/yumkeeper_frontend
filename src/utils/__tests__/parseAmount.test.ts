import { describe, expect, it } from "vitest";
import { parseAmountToQuantityAndUnit } from "@/utils/parseAmount";

describe("parseAmountToQuantityAndUnit", () => {
  describe("正常系 - 半角入力", () => {
    it("1g -> quantity: 1, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit("1g")).toEqual({ quantity: 1, unit: "g" });
    });

    it("1.5g -> quantity: 1.5, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit("1.5g")).toEqual({ quantity: 1.5, unit: "g" });
    });

    it("1/2g -> quantity: 0.5, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit("1/2g")).toEqual({ quantity: 0.5, unit: "g" });
    });
  });

  describe("正常系 - 全角入力", () => {
    it("１g -> quantity: 1, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit("１g")).toEqual({ quantity: 1, unit: "g" });
    });

    it("１.５g -> quantity: 1.5, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit("１.５g")).toEqual({ quantity: 1.5, unit: "g" });
    });

    it("１／２g -> quantity: 0.5, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit("１／２g")).toEqual({ quantity: 0.5, unit: "g" });
    });
  });

  describe("数値だけ or 単位だけ", () => {
    it("2 -> quantity: 2, unit: ''", () => {
      expect(parseAmountToQuantityAndUnit("2")).toEqual({ quantity: 2, unit: "" });
    });

    it("適量 -> quantity: null, unit: '適量'", () => {
      expect(parseAmountToQuantityAndUnit("適量")).toEqual({ quantity: null, unit: "適量" });
    });

    it("１／２ -> quantity: 0.5, unit: ''", () => {
      expect(parseAmountToQuantityAndUnit("１／２")).toEqual({ quantity: 0.5, unit: "" });
    });
  });

  describe("空白や無効な入力", () => {
    it('""（空白） -> quantity: null, unit: ""', () => {
      expect(parseAmountToQuantityAndUnit("")).toEqual({ quantity: null, unit: "" });
    });

    it("1/0g（0除算）-> quantity: null, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit("1/0g")).toEqual({ quantity: null, unit: "g" });
    });

    it("1//2g（不正分数）-> quantity: null, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit("1//2g")).toEqual({ quantity: null, unit: "g" });
    });
  });

  describe("前後に空白があっても処理される", () => {
    it("' 1g ' -> quantity: 1, unit: 'g'", () => {
      expect(parseAmountToQuantityAndUnit(" 1g ")).toEqual({ quantity: 1, unit: "g" });
    });

    it("'１／２　大さじ' -> quantity: 0.5, unit: '大さじ'", () => {
      expect(parseAmountToQuantityAndUnit("１／２　大さじ")).toEqual({ quantity: 0.5, unit: "大さじ" });
    });
  });
});
