"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Home() {
  const context = useContext(AuthContext);

  // AuthProvider のラップ漏れチェック
  if (!context) {
    throw new Error("Home must be used within an AuthProvider.");
  }

  const { isAuthenticated, isAuthChecked } = context;

  if (!isAuthChecked) return; // 認証チェック中は何も描画しない（チラつき防止）

  // 認証後のトップページ
  if (isAuthenticated) {
    return (
      <section className="py-32">
        {/* コピー文 */}
        <h2 className="text-4xl font-semibold text-gray-800 text-left">
          レシピ探しも、管理も、これひとつでOK。
        </h2>
        <h2 className="text-4xl font-semibold text-gray-800 text-left mt-6">
          保存しておけば、作りたくなる日が来る。
        </h2>

        <div className="mt-56 flex items-center gap-16">
          <Link href="/recipes/new">
            <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-red-800 text-white text-lg font-semibold hover:bg-red-900 transition ml-2">
              <Plus size={20}/> レシピを追加する
            </button>
          </Link>

          <Link href="/recipes/index">
            <span className="text-xl text-gray-800 hover:underline">
              レシピ一覧へ
            </span>
          </Link>
        </div>
      </section>
    );
  }

  // 認証前のトップページ
  return (
    <section className="py-32">
      {/* メインコピー */}
      <h1 className="text-7xl font-bold text-left text-gray-800">
        料理レシピは活字より、<br />
        <span className="inline-block w-full text-gray-800 text-right mt-8">
          <span className="relative inline-block">

            {/* 「動画」のアニメーション表示 + 下線 */}
            <span className="relative inline-block">
              <span
                className="opacity-0 animate-fade-in"
                style={{
                  animationDelay: "1s",
                  animationDuration: "1s",
                  animationFillMode: "forwards"
                }}
              >
                動画
              </span>
              <span
                className="absolute -bottom-2 left-0 h-[4px] bg-red-800 w-0 animate-underline"
                style={{
                  animationDelay: "1.5s",
                  animationDuration: "0.5s",
                  animationFillMode: "forwards"
                }}
              />
            </span>

            派のあなたへ。
          </span>
        </span>
      </h1>

      {/* サブコピー */}
      <div className="text-gray-700 text-center mt-20">
        <p className="text-2xl">
          <span className="text-3xl font-semibold text-black">Yum Keeper</span>は、動画に特化した料理レシピ保存サービスです。
        </p>
        <p className="text-2xl mt-4">
        <span className="text-3xl">YouTube</span>の動画と共にレシピをシンプルに管理しよう！
        </p>
      </div>

      {/* サインアップボタン */}
      <div className="mt-32 text-center">
        <Link href="/signup">
          <button className="px-8 py-4 rounded-full bg-red-800 text-white text-lg font-semibold  hover:bg-red-900 transition">
            登録する
          </button>
        </Link>
        <p className="text-lg mt-4">ゲストログイン機能を用意しています</p>
        <p className="text-lg mt-1">（メールアドレス・パスワードの登録不要）</p>
      </div>
    </section>
  );
}
