// レシピ登録時に quantity: null なら他ページのフォームに `null` と表示されないよう整形

export const formatAmount = (quantity: number | null, unit: string): string => {
  return quantity !== null ? `${quantity}${unit}` : unit;
};
