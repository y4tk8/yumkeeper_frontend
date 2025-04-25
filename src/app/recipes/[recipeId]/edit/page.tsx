"use client";

import { useState, useEffect } from "react";
import { useApiClient } from "@/lib/api/useApiClient";
import { useParams, useRouter } from "next/navigation";
import { mapItems, mapIngredientsToEntries } from "@/utils/mapItems";
import { Recipe, ItemEntry, ItemEntryWithoutId } from "@/types/recipe";
import { Video, VideoWithoutId } from "@/types/video";
import { RecipeResponse } from "@/types/api";
import { showSuccessToast, showErrorToast } from "@/components/ui/shadcn/sonner";
import { v4 as uuidv4 } from "uuid";
import IngredientFields from "@/components/recipes/IngredientFields";
import SeasoningFields from "@/components/recipes/SeasoningFields";
import VideoEmbedBlock from "@/components/recipes/VideoEmbedBlock";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function RecipeEditPage() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<ItemEntry[]>([{ id: uuidv4(), name: "", amount: "" }]);
  const [seasonings, setSeasonings] = useState<ItemEntry[]>([{ id: uuidv4(), name: "", amount: "" }]);
  const [notes, setNotes] = useState("");
  const [videoInfo, setVideoInfo] = useState<Video | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { request, userId } = useApiClient();
  const { recipeId } = useParams();
  const router = useRouter();

  // 初期データ取得
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!userId || !recipeId) return;

      try {
        const res = await request(`/api/v1/users/${userId}/recipes/${recipeId}`, "GET");
        const recipe = res.data.recipe as Recipe; // NOTE: 期限優先でひとまず as Recipe で対応。ジェネリクスが本来はベスト。

        setName(recipe.name);
        setNotes(recipe.notes || "");

        // 取得した材料データを表示用に整形
        const ing = recipe.ingredients ? mapIngredientsToEntries(recipe.ingredients, "ingredient") : [];
        setIngredients(ing.length > 0 ? ing : [{ id: uuidv4(), name: "", amount: "" }]);

        // 取得した調味料データを表示用に整形
        const seas = recipe.ingredients ? mapIngredientsToEntries(recipe.ingredients, "seasoning") : [];
        setSeasonings(seas.length > 0 ? seas : [{ id: uuidv4(), name: "", amount: "" }]);

        if (recipe.video) {
          setVideoInfo(recipe.video);
        }
      } catch (e) {
        showErrorToast("通信エラーが発生しました");

        if (process.env.NODE_ENV !== "production") {
          console.error("APIエラー:", e)
        }
      }
    };

    fetchRecipe();
  }, [userId, recipeId]);

  // 材料・調味料の入力変更
  const handleChange = (
    id: number | string,
    key: keyof ItemEntryWithoutId,
    value: string,
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    setter(items.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    ));
  };

  // 材料・調味料の入力行を追加
  const handleAdd = (
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    setter([...items, { id: uuidv4(), name: "", amount: "" }]);
  };

  // 材料・調味料の入力行を削除
  const handleRemove = (
    id: number | string,
    setter: React.Dispatch<React.SetStateAction<ItemEntry[]>>,
    items: ItemEntry[],
  ) => {
    const newItems = [...items];
    const targetIndex = newItems.findIndex((item) => item.id === id);

    if (targetIndex === -1) return;

    const target = newItems[targetIndex];

    if (typeof target.id === "number") {
      newItems[targetIndex] = { ...target, _destroy: true }  // idあり -> 該当レコードをDBから削除
    } else {
      newItems.splice(targetIndex, 1); // idなし -> UIから削除するだけ
    }

    setter(newItems);
  };

  // レシピの更新処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      const ingredientsData = mapItems(ingredients, "ingredient");
      const seasoningsData = mapItems(seasonings, "seasoning");
      const videoAttributes = videoInfo ? {
        ...videoInfo,
        id: "id" in videoInfo && videoInfo.id,
        ...(videoInfo._destroy ? { _destroy: true } : {}),
      } : undefined;

      const payload = {
        recipe: {
          name, notes,
          ingredients_attributes: [...ingredientsData, ...seasoningsData],
          video_attributes: videoAttributes,
        },
      };

      const res = await request<RecipeResponse>(`/api/v1/users/${userId}/recipes/${recipeId}`, "PATCH", payload);

      if (res.ok) {
        showSuccessToast(res.data.message || "レシピが更新されました");

        router.push(`/recipes/${recipeId}`);
      } else {
        showErrorToast(res.data.error || "レシピの更新に失敗しました");
      }
    } catch (e) {
      showErrorToast("通信エラーが発生しました");

      if (process.env.NODE_ENV !== "production") {
        console.error("APIエラー:", e)
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 動画をDBから削除するために _destroy: true を付与
  const markVideoForDeletion = () => {
    if (videoInfo) {
      setVideoInfo({ ...videoInfo, _destroy: true });
    }
  };

  // 新しい動画で置換。PATCHでDBレコードを更新するため、id は元動画の値をセット。
  const replaceVideo = (newVideo: VideoWithoutId) => {
    if (videoInfo?.id) {
      setVideoInfo({
        ...videoInfo,
        ...newVideo,
        id: videoInfo.id,
        _destroy: false,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12 px-4">
      <h1 className="text-2xl font-bold mb-12">レシピを編集</h1>
      <div className="max-w-2xl mx-auto">
        {/* レシピ名 */}
        <InputField
          type="text"
          placeholder="レシピ名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* 材料 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">材料</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {ingredients.filter(item => !item._destroy).map((item, index, filtered) => (
            <IngredientFields
              key={item.id}
              index={index}
              item={item}
              total={filtered.length}
              onChange={(key, value) => handleChange(item.id!, key, value, setIngredients, ingredients)}
              onAdd={() => handleAdd(setIngredients, ingredients)}
              onRemove={() => handleRemove(item.id!, setIngredients, ingredients)}
            />
          ))}
        </div>
      </section>

      {/* 調味料 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">調味料</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {seasonings.filter(item => !item._destroy).map((item, index, filtered) => (
            <SeasoningFields
              key={item.id}
              index={index}
              item={item}
              total={filtered.length}
              onChange={(key, value) => handleChange(item.id!, key, value, setSeasonings, seasonings)}
              onAdd={() => handleAdd(setSeasonings, seasonings)}
              onRemove={() => handleRemove(item.id!, setSeasonings, seasonings)}
            />
          ))}
        </div>
      </section>

      {/* 自由メモ */}
      <section>
        <h2 className="text-lg font-semibold -mb-4">自由メモ</h2>
        <div className="max-w-2xl mx-auto space-y-8">
          <textarea
            placeholder="メモを入力できます"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mx-auto h-40 rounded-md border border-black px-4 py-2 my-8"
          />
        </div>
      </section>

      {/* YouTube 埋め込み */}
      <div className="max-w-2xl mx-auto space-y-8">
        <VideoEmbedBlock
          videoInfo={videoInfo}
          setVideoInfo={setVideoInfo}
          onDelete={markVideoForDeletion}
          onReplace={replaceVideo}
        />

        {/* 更新ボタン */}
        <div className="text-center py-24">
          <Button fullWidth onClick={handleSubmit}>
            レシピを更新
          </Button>
        </div>
      </div>
    </div>
  );
}
