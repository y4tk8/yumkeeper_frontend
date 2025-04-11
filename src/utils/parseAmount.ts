// 材料 or 調味料の `分量` フォームに入力された値を `量` と `単位` に分解

export function parseAmountToQuantityAndUnit(amount: string): {
  quantity: number | null;
  unit: string;
} {
  if (!amount) return { quantity: null, unit: "" };

  // ([\d./]+)? -> 数字・ピリオド・スラッシュからなる `量`（1/2, 1.5など）をキャプチャ
  // \s*(.*) -> 空白以外の残り全部を `単位` としてキャプチャ
  const match = amount.trim().match(/^([\d./]+)?\s*(.*)$/);

  // 分量フォームの値が正規表現に合致しないなら、unit の値として返す
  if (!match) return { quantity: null, unit: amount };

  let quantity: number | null = null;
  const rawQuantity = match[1]; // 量 を抽出
  const unit = match[2].trim(); // 単位 を抽出

  if (rawQuantity) {
    // 文字列の 分数 や 小数 を数値へ置換
    if (rawQuantity.includes("/")) {
      const [num, denom] = rawQuantity.split("/").map(Number);
      if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
        quantity = num / denom;
      }
    } else {
      const parsed = parseFloat(rawQuantity);
      quantity = isNaN(parsed) ? null : parsed;
    }
  }

  return { quantity, unit };
}
