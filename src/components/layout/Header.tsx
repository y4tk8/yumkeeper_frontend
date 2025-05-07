"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/shadcn/popover";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";

export default function Header() {
  const context = useContext(AuthContext);
  const router = useRouter();
  const { request } = useApiClient();
  const { handleClientError } = useClientErrorHandler();

  // AuthProvider のラップ漏れチェック
  if (!context) {
    throw new Error("Header must be used within an AuthProvider.");
  }

  const { isAuthenticated, isAuthChecked, setAuthHeaders, setUserId } = context;

  if (!isAuthChecked) return; // 認証チェック中は何も描画しない（チラつき防止）

  // サインアウト処理
  const handleSignOut = async () => {
    try {
      const res = await request("/api/v1/auth/sign_out", "DELETE");

      if (res.ok) {
        // クライアント側の認証情報 & ユーザーIDを削除
        setAuthHeaders(null);
        setUserId(null);

        showSuccessToast("ログアウトしました");
        router.push("/");
      } else {
        handleClientError(res.status);
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.error("APIエラー:", e);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-100 shadow-md flex items-center justify-between px-24 py-4">
      {/* サービスロゴ */}
      <Link href="/">
        <h1 className="text-3xl font-bold">Yum Keeper</h1>
      </Link>

      <nav>
        <ul className="flex items-center gap-8">
          {/* 認証後のヘッダーリスト */}
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/recipes/new">
                  <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-black text-white hover:bg-gray-700 transition">
                    <Plus size={20}/> レシピ追加
                  </button>
                </Link>
              </li>

              <li>
                <Popover>
                  <PopoverTrigger asChild>
                    <Image
                      src="/images/default-profile-image.png"
                      alt="プロフィール画像"
                      width={44}
                      height={44}
                      className="object-cover rounded-full cursor-pointer"
                    />
                  </PopoverTrigger>

                  {/* メニューモーダル */}
                  <PopoverContent
                    className="w-48 rounded-lg bg-white shadow-lg"
                    align="end"
                    sideOffset={10}
                  >
                    <ul className="flex flex-col gap-4">
                      <li>
                        <Link
                          href="/recipes/index"
                          className="block text-gray-700 hover:bg-gray-100 rounded-md p-2 transition"
                        >
                          レシピ一覧
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left text-gray-700 hover:bg-gray-100 rounded-md p-2 transition focus:outline-none"
                        >
                          ログアウト
                        </button>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </li>
            </>
          ) : (
            // 認証前のヘッダーリスト
            <>
              <li>
                <Link href="/signin" className="hover:underline">ログイン</Link>
              </li>

              <li>
                <Link href="/signup">
                  <button className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-700 transition">
                    登録する
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
