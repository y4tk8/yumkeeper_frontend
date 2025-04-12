"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/useApiClient";
import { mapItems } from "@/utils/mapItems";
import { ItemEntry } from "@/types/recipe";
import IngredientFields from "@/components/recipes/IngredientFields";
import SeasoningFields from "@/components/recipes/SeasoningFields";
import VideoEmbedBlock from "@/components/recipes/VideoEmbedBlock";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function RecipeNewPage() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<ItemEntry[]>([{ name: "", amount: "" }]);
  const [seasonings, setSeasonings] = useState<ItemEntry[]>([{ name: "", amount: "" }]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { request, userId } = useApiClient();

  // フォームの入力値を変更
  const handleChange = (
    index: number,
    key: keyof ItemEntry, // `name` または `amount`
    value: string,
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    const newItems = [...items]; // 配列内の { name: 〇〇, amount: 〇〇 } として存在する要素を展開
    newItems[index][key] = value; // 入力値を更新
    setter(newItems); // 状態（State）を更新
  };

  // 入力フォームの行を追加
  const handleAdd = (
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    setter([...items, { name: "", amount: "" }]);
  };

  // 入力フォームの行を削除
  const handleRemove = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    setter(items.filter((_, i) => i !== index));
  };

  // 新しいレシピの登録処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      if (!userId) {
        alert("サインインが必要です");
        return;
      }

      // 材料と調味料の全ての入力値を map で処理
      const ingredientsData = mapItems(ingredients, "ingredient");
      const seasoningsData = mapItems(seasonings, "seasoning");

      const res = await request(`/api/v1/users/${userId}/recipes`, "POST", {
        recipe: {
          name,
          ingredients_attributes: [...ingredientsData, ...seasoningsData],
          notes,
        },
      });

      router.push("/recipes/index");
    } catch (e) {
      console.error("レシピ登録エラー", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold">新しいレシピを追加</h1>

      {/* レシピ名 */}
      <InputField
        type="text"
        placeholder="レシピ名"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* 材料 */}
      <div>
        <p className="font-semibold mb-2">材料</p>
        {ingredients.map((item, index) => (
          <IngredientFields
            key={index}
            item={item}
            onChange={(key: keyof ItemEntry, value) =>
              handleChange(index, key, value, setIngredients, ingredients)
            }
            onAdd={() => handleAdd(setIngredients, ingredients)}
            onRemove={() => handleRemove(index, setIngredients, ingredients)}
            isFirst={index === 0}
            isLast={index === ingredients.length - 1}
          />
        ))}
      </div>

      {/* 調味料 */}
      <div>
        <p className="font-semibold mb-2">調味料</p>
        {seasonings.map((item, index) => (
          <SeasoningFields
            key={index}
            item={item}
            onChange={(key: keyof ItemEntry, value) =>
              handleChange(index, key, value, setSeasonings, seasonings)
            }
            onAdd={() => handleAdd(setSeasonings, seasonings)}
            onRemove={() => handleRemove(index, setSeasonings, seasonings)}
            isFirst={index === 0}
            isLast={index === seasonings.length - 1}
          />
        ))}
      </div>

      {/* 自由メモ */}
      <textarea
        placeholder="メモを入力できます"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-40 rounded-md border border-black px-4 py-2"
      />

      {/* YouTube 埋め込み */}
      <VideoEmbedBlock />

      {/* 追加ボタン */}
      <div className="text-center pt-4">
        <Button fullWidth onClick={handleSubmit}>
          レシピを追加する
        </Button>
      </div>
    </div>
  );
}
