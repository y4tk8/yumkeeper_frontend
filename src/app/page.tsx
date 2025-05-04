"use client";

import Link from "next/link";

export default function Home() {
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
          YouTubeの動画と共にレシピをシンプルに管理しよう！
        </p>
      </div>

      {/* ボタン */}
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
