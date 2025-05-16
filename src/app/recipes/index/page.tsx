"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { apiResult } from "@/types/api";
import { RecipeCard } from "@/types/recipe";
import { Pagination } from "@/components/ui/Pagination";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/shadcn/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/shadcn/popover";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import Button from "@/components/ui/Button";

const SORT_OPTIONS = [
  { label: "最新の更新順", value: "updated_desc" },
  { label: "追加日（新しい順）", value: "created_desc" },
  { label: "追加日（古い順）", value: "created_asc" },
];

export default function RecipeIndexPage() {
  useRequireAuth(); // 未認証ならリダイレクト
  useErrorToast(); // 未認可でリダイレクトされてきた場合 -> エラートースト表示

  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [selectedSort, setSelectedSort] = useState("updated_desc");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, count: 0, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { request, userId } = useApiClient();
  const { handleClientError } = useClientErrorHandler();

  // レシピ一覧の取得処理
  useEffect(() => {
    if (!userId) return;

    const fetchRecipes = async () => {
      setIsLoading(true);

      try {
        const query = new URLSearchParams({
          sort: selectedSort,
          page: String(currentPage),
        }).toString();

        const res = await request<{ recipes: RecipeCard[] }>(`/api/v1/users/${userId}/recipes?${query}`, "GET");

        if (!res.ok) {
          handleClientError(res.status);
          return;
        }

        // ページネーション情報を取得
        const headers = res.headers;
        const page = Number(headers.get("current-page") || "1");
        const limit = Number(headers.get("page-items") || "20");
        const count = Number(headers.get("total-count") || "0");
        const totalPages = Number(headers.get("total-pages") || "1");

        setPagination({ page, limit, count, totalPages });
        setRecipes(res.data.recipes);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.error("APIエラー:", e)
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [userId, currentPage, selectedSort]);

  // ページ遷移時にスクロール位置をリセット
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPage]);

  // レシピの削除処理
  const deleteRecipe = async () => {
    if (!deleteId) return;

    try {
      const res = await request<apiResult>(`/api/v1/users/${userId}/recipes/${deleteId}`, "DELETE");

      if (res.ok) {
        setRecipes((prev) => prev.filter((r) => r.id !== deleteId)); // UIを即時更新
        showSuccessToast(res.data.message || "レシピが削除されました");
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

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-12">レシピ一覧</h1>

      {/* 並び替え */}
      <div className="flex justify-end mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded-md shadow-sm hover:bg-gray-100 transition">
              並び替え <ChevronDown className="w-5 h-5" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-56 rounded-lg bg-white shadow-lg border border-gray-200 p-2 z-50"
            align="end"
            sideOffset={10}
          >
            <ul className="flex flex-col py-2">
              {SORT_OPTIONS.map((option) => (
                <li key={option.value}>
                  <button
                    onClick={() => setSelectedSort(option.value)}
                    className={`w-full flex items-center text-left p-3 text-sm text-gray-700 rounded-md transition ${
                      option.value === selectedSort ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  >
                    {option.value === selectedSort ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <span className="w-4 h-4 mr-2"></span>
                    )}
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-28 w-28 animate-spin text-gray-500"/>
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-32 text-gray-500 text-xl">
          レシピがありません
        </div>
      ) : (
        <>
          {/* レシピカード */}
          <div className="space-y-24">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-200"
              >
                <Link href={`/recipes/${recipe.id}`}>
                  <Image
                    src={recipe.thumbnail_url || "/images/default-thumbnail.jpeg"}
                    alt={`${recipe.name}の動画サムネイル`}
                    width={800}
                    height={450}
                    className="w-full object-cover hover:scale-105 transition-transform duration-200"
                    style={{ aspectRatio: "16 / 9" }}
                  />
                </Link>
                <div className="grid grid-cols-10 items-center bg-white px-4 py-2">
                  <Link
                    href={`/recipes/${recipe.id}/`}
                    className="col-span-8 text-lg font-semibold p-2 hover:underline"
                  >
                    {recipe.name}
                  </Link>
                  <Link
                    href={`/recipes/${recipe.id}/edit`}
                    className="col-span-1 text-sm text-green-600 text-center hover:underline"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => openDeleteModal(recipe.id)}
                    className="col-span-1 text-sm text-red-600 text-center hover:underline"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ページネーション */}
          <div className="mt-20 mb-20 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

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
