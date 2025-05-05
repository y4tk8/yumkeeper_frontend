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
        <h2 className="text-4xl font-semibold text-left">
          レシピ探しも、管理も、これひとつでOK。
        </h2>
        <h2 className="text-4xl font-semibold text-left mt-6">
          保存しておけば、作りたくなる日が来る。
        </h2>

        <div className="mt-56 flex items-center gap-16">
          <Link href="/recipes/new">
            <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-lg font-semibold hover:bg-gray-700 transition ml-2">
              <Plus size={20}/> レシピを追加する
            </button>
          </Link>

          <Link href="/recipes/index">
            <span className="text-xl text-gray-700 hover:underline">
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
      <h1 className="text-7xl font-bold text-left">
        料理レシピは活字より、<br />
        <span className="inline-block w-full text-right mt-8">動画派のあなたへ。</span>
      </h1>

      {/* サブコピー */}
      <div className="mt-20 text-center">
        <p className="text-2xl">
          <span className="text-3xl font-semibold">Yum Keeper</span>は、動画に特化した料理レシピ保存サービスです。
        </p>
        <p className="mt-4 text-2xl">
        <span className="text-3xl">YouTube</span>の動画と共にレシピをシンプルに管理しよう！
        </p>
      </div>

      {/* サインアップボタン */}
      <div className="mt-32 text-center">
        <Link href="/signup">
          <button className="px-8 py-4 rounded-full bg-black text-white text-lg font-semibold hover:bg-gray-700 transition">
            登録する
          </button>
        </Link>
        <p className="text-lg mt-4">ゲストログイン機能を用意しています</p>
        <p className="text-lg mt-1">（メールアドレス・パスワードの登録不要）</p>
      </div>
    </section>
  );
}
