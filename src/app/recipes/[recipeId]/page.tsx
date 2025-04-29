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

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12 px-4">
      {/* レシピ名 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">レシピ名</h2>
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
      <section>
        <h2 className="text-lg font-semibold mb-4">材料</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {ingredients?.map((item, index) => (
            <IngredientFields
              key={item.id}
              index={index}
              total={ingredients.length}
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
      <section>
        <h2 className="text-lg font-semibold mb-4">調味料</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {seasonings?.map((item, index) => (
            <SeasoningFields
              key={item.id}
              index={index}
              total={seasonings.length}
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
      <section>
        <h2 className="text-lg font-semibold -mb-4">自由メモ</h2>
        <div className="max-w-2xl mx-auto space-y-8">
          <textarea
            value={recipe?.notes ?? ""}
            readOnly
            className="w-full mx-auto h-48 rounded-md border border-black px-4 py-2 my-8"
          />
        </div>
      </section>

      {/* YouTube 埋め込み */}
      <div className="max-w-2xl mx-auto space-y-8">
        {recipe?.video && (
          <VideoDisplay video={recipe.video} />
        )}
      </div>
    </div>
  );
}
