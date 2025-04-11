import { MinusCircle, PlusCircle } from "lucide-react";
import { ItemEntry } from "@/types/recipe";

interface IngredientFieldProps {
  item: ItemEntry;
  onChange: (key: keyof ItemEntry, value: string) => void;
  onAdd: () => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}

// 材料 の入力フォーム
export default function IngredientFields({
  item,
  onChange,
  onAdd,
  onRemove,
  isFirst,
  isLast,
}: IngredientFieldProps) {
  return (
    <div className="flex items-center space-x-2 mb-2">
      {!isFirst && (
        <button onClick={onRemove}>
          <MinusCircle className="text-red-500" />
        </button>
      )}
      <input
        type="text"
        placeholder="材料名"
        value={item.name}
        onChange={(e) => onChange("name", e.target.value)}
        className="flex-[7] border p-2 rounded"
      />
      <input
        type="text"
        placeholder="分量"
        value={item.amount}
        onChange={(e) => onChange("amount", e.target.value)}
        className="flex-[3] border p-2 rounded"
      />
      {isLast && (
        <button onClick={onAdd}>
          <PlusCircle className="text-green-500" />
        </button>
      )}
    </div>
  );
}
