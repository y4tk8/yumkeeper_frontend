"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { handleClientError } from "@/utils/handleClientError";
import { RecipeCard } from "@/types/recipe";
import { apiResult } from "@/types/api";
import { Pagination } from "@/components/ui/Pagination";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/shadcn/dialog";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

const SORT_OPTIONS = [
  { label: "最新の更新順", value: "updated_desc" },
  { label: "追加日（新しい順）", value: "created_desc" },
  { label: "追加日（古い順）", value: "created_asc" },
];

export default function RecipeIndexPage() {
  useRequireAuth(); // 未認証ならリダイレクト

  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [selectedSort, setSelectedSort] = useState("updated_desc");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, count: 0, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);

  const { request, userId } = useApiClient();

  // レシピ一覧の取得処理
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const query = new URLSearchParams({
          sort: selectedSort,
          page: String(currentPage),
        }).toString();

        const res = await request<{ recipes: RecipeCard[] }>(`/api/v1/users/${userId}/recipes?${query}`, "GET");

        if (!res.ok) {
          handleClientError(res.status);
        }

        // ページネーション情報を取得
        const headers = res.headers;
        setPagination({
          page: Number(headers.get("Current-Page")),
          limit: Number(headers.get("Page-Items")),
          count: Number(headers.get("Total-Count")),
          totalPages: Number(headers.get("Total-Pages")),
        });

        setRecipes(res.data.recipes);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.error("APIエラー:", e)
        }
      }
    };

    fetchRecipes();
  }, [userId, currentPage, selectedSort]);

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">レシピ一覧</h1>

        {/* 並び替え */}
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center px-3 py-1 border rounded-md shadow-sm transition hover:bg-gray-100">
            並び替え <ChevronDown className="ml-1 w-4 h-4" />
          </MenuButton>
          <MenuItems className={`absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200
                                divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 focus:outline-none`}>
            <div className="py-1">
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value}>
                  {({ active }: { active: boolean }) => (
                    <Button
                      onClick={() => setSelectedSort(option.value)}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center`}
                    >
                      {option.value === selectedSort && <Check className="w-4 h-4 mr-2" />} {option.label}
                    </Button>
                  )}
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Menu>
      </div>

      {/* レシピ一覧 */}
      <div className="space-y-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-200"
            style={{ aspectRatio: "5 / 3" }}
          >
            <Link href={`/recipes/${recipe.id}`}>
              <Image
                src={recipe.thumbnail_url || "/images/default-thumbnail.jpeg"}
                alt={`${recipe.name}の動画サムネイル`}
                width={800}
                height={480}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <div className="grid grid-cols-10 gap-2 items-center px-4 py-3 bg-white">
              <Link href={`/recipes/${recipe.id}/`} className="col-span-6 text-lg font-semibold hover:underline">
                {recipe.name}
              </Link>
              <Link href={`/recipes/${recipe.id}/edit`} className="col-span-2 text-sm text-green-600 hover:underline">
                編集
              </Link>
              <button
                onClick={() => openDeleteModal(recipe.id)}
                className="col-span-2 text-sm text-red-600 hover:underline"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
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
