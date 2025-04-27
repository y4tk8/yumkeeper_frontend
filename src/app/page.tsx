"use client";

import { useErrorToast } from "@/hooks/useErrorToast";

export default function Home() {
  useErrorToast(); // 未認可でリダイレクトされてきた場合 -> エラートースト表示

  // APIレスポンス取得のハンドラー
  const handleApiRequest = async () => {
    const response = await fetch("http://localhost:8080");
    const text = response.text();
    console.log(text);
  };

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20">
      <main className="row-start-2 flex flex-col items-center gap-8">
        {/* APIリクエストの送信ボタン */}
        <button
          onClick={handleApiRequest}
          className="rounded-full border border-black px-6"
        >
          APIリクエスト
        </button>
      </main>
    </div>
  );
}
