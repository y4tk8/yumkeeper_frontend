"use client";

import Link from "next/link";

const VerifyAccountPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-md border border-gray-300 shadow-sm text-center">
        <h2 className="text-xl font-semibold mb-6">本登録はまだ完了していません</h2>
        <ul className="text-gray-600 text-sm list-disc list-inside mb-6 text-left">
          <li>通常、メールは数分以内に届きます。</li>
          <li>メールが見つからない場合、迷惑メールフォルダに振り分けられていることがあります。</li>
          <li>しばらく経ってもメールが届かない場合はメールアドレスが正しいか確認の上、再送をお試しください。</li>
        </ul>

        <Link href="/resend-confirmation" className="text-blue-600 hover:underline">
          認証メールを再送する場合はこちら
        </Link>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
