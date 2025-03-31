"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function SingUpPage() {
  const router = useRouter();

  // 'サインアップ'押下時のイベントハンドラー
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // サインアップ処理を後で追加（APIリクエスト）

    router.push("/verify-account")
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">サインアップ</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField type="email" placeholder="メールアドレス" />
        <InputField type="password" placeholder="パスワード" />
        <InputField type="password" placeholder="パスワード確認用" />

        <Button type="submit" fullWidth>
          サインアップ
        </Button>
      </form>

      <div className="flex justify-between text-sm">
        <span>アカウントをお持ちですか？</span>
        <Link href="/signin" className="text-blue-600 hover:underline">
          サインインはこちら
        </Link>
      </div>

      {/* 区切り線 */}
      <div className="relative y-6">
        <div className="absolute inset-x-4 top-1/2 h-px bg-gray-300"></div>
      </div>

      <Button type="button" variant="outline" fullWidth>
        ゲストとしてサインインする
      </Button>
    </div>
  );
}
