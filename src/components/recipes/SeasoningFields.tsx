import { MinusCircle, PlusCircle } from "lucide-react";
import { ItemEntry } from "@/types/recipe";

interface SeasoningFieldProps {
  index: number;
  total: number;
  item: ItemEntry;
  onChange: (key: keyof ItemEntry, value: string) => void;
  onAdd: () => void;
  onRemove: () => void;
}

// 調味料 の入力フォーム
export default function SeasoningsFields({
  index,
  total,
  item,
  onChange,
  onAdd,
  onRemove,
}: SeasoningFieldProps) {
  const isLast = index === total - 1;
  const showPlus = isLast;
  const showMinus = !isLast;

  return (
    <div className="relative flex items-center mb-2">
      <div className="absolute -left-8 top-1/2 -translate-y-1/2">
        {showPlus && (
          <button onClick={onAdd} aria-label="調味料を追加">
            <PlusCircle className="text-green-500" />
          </button>
        )}
        {showMinus && (
          <button onClick={onRemove} aria-label="調味料を削除">
            <MinusCircle className="text-red-500" />
          </button>
        )}
      </div>

      <div className="flex w-full gap-2">
        <input
          type="text"
          placeholder="調味料名"
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
      </div>
    </div>
  );
}
