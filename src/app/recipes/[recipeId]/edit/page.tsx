"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { useParams, useRouter } from "next/navigation";
import { mapItems, mapIngredientsToEntries } from "@/utils/mapItems";
import { Recipe, ItemEntry, ItemEntryWithoutId } from "@/types/recipe";
import { Video, VideoWithoutId } from "@/types/video";
import { apiResult } from "@/types/api";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import { v4 as uuidv4 } from "uuid";
import IngredientFields from "@/components/recipes/IngredientFields";
import SeasoningFields from "@/components/recipes/SeasoningFields";
import VideoEmbedBlock from "@/components/recipes/VideoEmbedBlock";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function RecipeEditPage() {
  useRequireAuth(); // 未認証ならリダイレクト

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<ItemEntry[]>([{ id: uuidv4(), name: "", amount: "" }]);
  const [seasonings, setSeasonings] = useState<ItemEntry[]>([{ id: uuidv4(), name: "", amount: "" }]);
  const [notes, setNotes] = useState("");
  const [videoInfo, setVideoInfo] = useState<Video | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string[]>([]);

  const { request, userId } = useApiClient();
  const { handleClientError } = useClientErrorHandler();
  const { recipeId } = useParams();
  const router = useRouter();

  // 初期データ取得
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!userId || !recipeId) return;

      try {
        const res = await request<{ recipe: Recipe }>(`/api/v1/users/${userId}/recipes/${recipeId}`, "GET");

        if (!res.ok) {
          handleClientError(res.status);
          return;
        }

        const recipe = res.data.recipe;

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
    setNameError([]);

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
          name,
          notes,
          ingredients_attributes: [...ingredientsData, ...seasoningsData],
          video_attributes: videoAttributes,
        },
      };

      const res = await request<apiResult>(`/api/v1/users/${userId}/recipes/${recipeId}`, "PATCH", payload);

      if (res.ok) {
        showSuccessToast(res.data.message || "レシピが更新されました");
        router.push(`/recipes/${recipeId}`);
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
    <div className="max-w-3xl mx-auto space-y-12 py-12 px-4">
      <h1 className="text-2xl font-bold">レシピを編集</h1>

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
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">調味料</h2>
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
          onDelete={markVideoForDeletion}
          onReplace={replaceVideo}
        />

        {/* 更新ボタン */}
        <div className="text-center pt-28">
          <Button fullWidth onClick={handleSubmit}>
            レシピを更新
          </Button>
        </div>
      </div>
    </div>
  );
}
