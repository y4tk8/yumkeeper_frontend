/**
 * 材料 or 調味料の `分量` フォームに入力された値を `量` と `単位` に分解する関数
 */
export function parseAmountToQuantityAndUnit(amount: string): {
  quantity: number | null;
  unit: string;
} {
  if (!amount) return { quantity: null, unit: "" };

  // 全角の数字、ピリオド、スラッシュを半角に変換
  const normalizedAmount = amount.replace(/[０-９．／]/g, (char) => {
    const fullToHalf: Record<string, string> = {
      "０": "0", "１": "1", "２": "2", "３": "3", "４": "4",
      "５": "5", "６": "6", "７": "7", "８": "8", "９": "9",
      "．": ".", "／": "/",
    };
    return fullToHalf[char] || char;
  });

  // ([\d./]+)? -> 数字・ピリオド・スラッシュからなる `量`（1/2, 1.5など）をキャプチャ
  // \s*(.*) -> 空白以外の残り全部を `単位` としてキャプチャ
  const match = normalizedAmount.trim().match(/^([\d./]+)?\s*(.*)$/);

  if (!match) return { quantity: null, unit: normalizedAmount };

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
