"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { useParams } from "next/navigation";
import { formatAmount } from "@/utils/formatAmount";
import { handleClientError } from "@/utils/handleClientError";
import { Recipe } from "@/types/recipe";
import IngredientFields from "@/components/recipes/IngredientFields";
import SeasoningFields from "@/components/recipes/SeasoningFields";
import VideoDisplay from "@/components/recipes/VideoDisplay";
import InputField from "@/components/ui/InputField";

export default function RecipeShowPage() {
  useRequireAuth(); // 未認証ならリダイレクト

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { request, userId } = useApiClient();
  const { recipeId } = useParams();

  // レシピ詳細の取得処理
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) return;

      try {
        const res = await request<{ recipe: Recipe }>(`/api/v1/users/${userId}/recipes/${recipeId}`, "GET");

        if (!res.ok) {
          handleClientError(res.status);
        }

        setRecipe(res.data.recipe);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.error("APIエラー:", e)
        }
      }
    };

    fetchRecipe();
  }, [userId, recipeId]);

  const ingredients = recipe?.ingredients?.filter(item => item.category === "ingredient") || [];
  const seasonings = recipe?.ingredients?.filter(item => item.category === "seasoning") || [];

  // 材料・調味料の登録あり -> 通常表示 / 登録なし -> 1行だけダミー表示
  const displayedIngredients = ingredients.length > 0 ? ingredients : [{ id: "dummy", name: "", quantity: null, unit: "", category: "ingredient" }];
  const displayedSeasonings = seasonings.length > 0 ? seasonings : [{ id: "dummy", name: "", quantity: null, unit: "", category: "seasoning" }];

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12 px-4">
      <div className="flex justify-between items-center">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-md border border-transparent hover:bg-gray-800 transition"
        >
          レシピ一覧へ
        </button>
        <div className="flex space-x-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md border border-transparent hover:bg-gray-700 transition"
          >
            編集
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md border border-transparent hover:bg-red-700 transition"
          >
            削除
          </button>
        </div>
      </div>

      {/* レシピ名 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">レシピ名</h2>
        <div className="max-w-2xl mx-auto">
          <InputField
            type="text"
            placeholder="レシピ名"
            value={recipe?.name ?? ""}
            readOnly
          />
        </div>
      </section>

      {/* 材料 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">材料</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {displayedIngredients.map((item, index) => (
            <IngredientFields
              key={item.id}
              index={index}
              total={displayedIngredients.length}
              item={{
                name: item.name,
                amount: formatAmount(item.quantity, item.unit),
              }}
              readOnly
            />
          ))}
        </div>
      </section>

      {/* 調味料 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">調味料</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {displayedSeasonings?.map((item, index) => (
            <SeasoningFields
              key={item.id}
              index={index}
              total={displayedSeasonings.length}
              item={{
                name: item.name,
                amount: formatAmount(item.quantity, item.unit),
              }}
              readOnly
            />
          ))}
        </div>
      </section>

      {/* 自由メモ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">自由メモ</h2>
        <div className="max-w-2xl mx-auto">
          <textarea
            value={recipe?.notes ?? ""}
            readOnly
            className="w-full mx-auto h-52 rounded-md border border-black px-4 py-2"
          />
        </div>
      </section>

      {/* YouTube 埋め込み */}
      <div className="max-w-2xl mx-auto space-y-8 pt-12 pb-24">
        <VideoDisplay video={recipe?.video ?? null} />
      </div>
    </div>
  );
}
