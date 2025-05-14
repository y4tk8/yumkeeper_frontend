"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

const VerifyAccountPage = () => {
  return (
    <>
      <div className="text-center space-y-10">
        <h2 className="text-xl">登録ありがとうございます</h2>

        <div className="flex items-center justify-center gap-2 mb-6">
          <AlertTriangle className="w-8 h-8 text-yellow-500"/>
          <h2 className="text-2xl font-semibold">本登録を完了するにはメールを認証してください</h2>
        </div>

        <ul className="text-gray-600 text-sm list-disc list-inside mb-6 text-left">
          <li>通常、メールは数分以内に届きます。</li>
          <li>メールが見つからない場合、迷惑メールフォルダに振り分けられていることがあります。</li>
          <li>しばらく経ってもメールが届かない場合はメールアドレスが正しいか確認の上、再送をお試しください。</li>
        </ul>
      </div>

      <div className="text-center mt-10">
        <Link href="/resend-confirmation" className="text-blue-600 hover:underline">
          認証メールを再送する場合はこちら
        </Link>
      </div>
    </>
  );
};

export default VerifyAccountPage;
