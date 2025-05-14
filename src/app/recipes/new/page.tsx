"use client";

import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { useRouter } from "next/navigation";
import { mapItems } from "@/utils/mapItems";
import { ItemEntry, ItemEntryWithoutId } from "@/types/recipe";
import { Video } from "@/types/video";
import { apiResult } from "@/types/api";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import IngredientFields from "@/components/recipes/IngredientFields";
import SeasoningFields from "@/components/recipes/SeasoningFields";
import VideoEmbedBlock from "@/components/recipes/VideoEmbedBlock";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function RecipeNewPage() {
  useRequireAuth(); // 未認証ならリダイレクト

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<ItemEntry[]>([{ name: "", amount: "" }]);
  const [seasonings, setSeasonings] = useState<ItemEntry[]>([{ name: "", amount: "" }]);
  const [notes, setNotes] = useState("");
  const [videoInfo, setVideoInfo] = useState<Video | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string[]>([]);

  const { request, userId } = useApiClient();
  const { handleClientError } = useClientErrorHandler();
  const router = useRouter();

  // 材料・調味料の入力変更
  const handleChange = (
    index: number,
    key: keyof ItemEntryWithoutId,
    value: string,
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    const newItems = [...items]; // 配列内の { name: 〇〇, amount: 〇〇 } として存在する要素を展開
    newItems[index][key] = value; // 入力値を更新
    setter(newItems); // 状態（State）を更新
  };

  // 材料・調味料の入力行を追加
  const handleAdd = (
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    setter([...items, { name: "", amount: "" }]);
  };

  // 材料・調味料の入力行を削除
  const handleRemove = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    setter(items.filter((_, i) => i !== index));
  };

  // レシピの追加処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);
    setNameError([]);

    try {
      const ingredientsData = mapItems(ingredients, "ingredient");
      const seasoningsData = mapItems(seasonings, "seasoning");
      const videoAttributes = videoInfo ? { ...videoInfo } : undefined;

      const payload = {
        recipe: {
          name,
          notes,
          ingredients_attributes: [...ingredientsData, ...seasoningsData],
          video_attributes: videoAttributes,
        },
      };

      const res = await request<apiResult>(`/api/v1/users/${userId}/recipes`, "POST", payload);

      if (res.ok) {
        showSuccessToast(res.data.message || "レシピが追加されました");
        router.push("/recipes/index");
      } else {
        handleClientError(res.status, res.data.error);

        if (res.status === 422 && res.data.details) {
          setNameError(res.data.details);
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.error("APIエラー:", e)
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12 px-4">
      <h1 className="text-2xl font-bold">レシピを追加</h1>

      {/* レシピ名 */}
      <section className="space-y-4">
        <div className="max-w-2xl mx-auto">
          <InputField
            type="text"
            placeholder="レシピ名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            errorMessages={nameError}
          />
        </div>
      </section>

      {/* 材料 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">材料</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {ingredients.map((item, index) => (
            <IngredientFields
              key={index}
              index={index}
              total={ingredients.length}
              item={item}
              onChange={(key, value) => handleChange(index, key, value, setIngredients, ingredients)}
              onAdd={() => handleAdd(setIngredients, ingredients)}
              onRemove={() => handleRemove(index, setIngredients, ingredients)}
            />
          ))}
        </div>
      </section>

      {/* 調味料 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">調味料</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {seasonings.map((item, index) => (
            <SeasoningFields
              key={index}
              index={index}
              total={seasonings.length}
              item={item}
              onChange={(key, value) => handleChange(index, key, value, setSeasonings, seasonings)}
              onAdd={() => handleAdd(setSeasonings, seasonings)}
              onRemove={() => handleRemove(index, setSeasonings, seasonings)}
            />
          ))}
        </div>
      </section>

      {/* 自由メモ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">自由メモ</h2>
        <div className="max-w-2xl mx-auto">
          <textarea
            placeholder="メモを入力できます"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mx-auto h-52 rounded-md border border-gray-400 px-4 py-2"
          />
        </div>
      </section>

      {/* YouTube 埋め込み */}
      <div className="max-w-2xl mx-auto space-y-8 pt-12 pb-24">
        <VideoEmbedBlock
          videoInfo={videoInfo}
          setVideoInfo={setVideoInfo}
        />

        {/* 追加ボタン */}
        <div className="text-center pt-28">
          <Button fullWidth onClick={handleSubmit}>
            レシピを追加
          </Button>
        </div>
      </div>
    </div>
  );
}
