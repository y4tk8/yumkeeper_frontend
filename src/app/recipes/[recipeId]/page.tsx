"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { useParams, useRouter } from "next/navigation";
import { formatAmount } from "@/utils/formatAmount";
import { Recipe } from "@/types/recipe";
import { apiResult } from "@/types/api";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/shadcn/dialog";
import IngredientFields from "@/components/recipes/IngredientFields";
import SeasoningFields from "@/components/recipes/SeasoningFields";
import VideoDisplay from "@/components/recipes/VideoDisplay";
import InputField from "@/components/ui/InputField";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function RecipeShowPage() {
  useRequireAuth(); // 未認証ならリダイレクト

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { request, userId } = useApiClient();
  const { handleClientError } = useClientErrorHandler();
  const { recipeId } = useParams();
  const router = useRouter();

  // レシピ詳細の取得処理
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!userId || !recipeId) return;

      try {
        const res = await request<{ recipe: Recipe }>(`/api/v1/users/${userId}/recipes/${recipeId}`, "GET");

        if (!res.ok) {
          handleClientError(res.status);
          return;
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

  // レシピの削除処理
  const deleteRecipe = async () => {
  if (!deleteId) return;

  try {
    const res = await request<apiResult>(`/api/v1/users/${userId}/recipes/${deleteId}`, "DELETE");

    if (res.ok) {
      showSuccessToast(res.data.message || "レシピが削除されました");
      router.push("/recipes/index");
    } else {
      handleClientError(res.status, res.data.error);
    }
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.error("APIエラー:", e)
    }
  } finally {
    closeDeleteModal();
  }
};

  // レシピIDをnumber型に変換の上、削除モーダルへ渡す
  const handleClickDelete = () => {
    if (!recipeId || Array.isArray(recipeId)) return;
    const idNumber = Number(recipeId);
    if (isNaN(idNumber)) return;
    openDeleteModal(idNumber);
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12 px-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/recipes/index")}
          className="bg-gray-500 text-white px-4 py-2 rounded-md border border-transparent hover:bg-gray-700 transition"
        >
          レシピ一覧へ
        </button>
        <div className="flex space-x-4 items-center">
          <Link
            href={`/recipes/${recipeId}/edit`}
            className="text-lg text-green-600 mr-2 hover:underline"
          >
            編集
          </Link>
          <button
            onClick={handleClickDelete}
            className="text-lg text-red-600 hover:underline"
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
            className="w-full mx-auto h-52 rounded-md border border-gray-400 px-4 py-2"
          />
        </div>
      </section>

      {/* YouTube 埋め込み */}
      <div className="max-w-2xl mx-auto space-y-8 pt-12 pb-24">
        <VideoDisplay video={recipe?.video ?? null} />
      </div>

      {/* 削除モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>レシピを削除しますか？</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteModal}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={deleteRecipe}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
