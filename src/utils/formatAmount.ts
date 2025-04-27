/**
 * レシピ登録時に quantity: null なら他ページレンダー時に `null` と表示されないよう整形する関数
 */
export const formatAmount = (quantity: number | null, unit: string): string => {
  return quantity !== null ? `${quantity}${unit}` : unit;
};
