"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/apiClient";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function SingUpPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // サインアップ処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("password_confirmation") as string;

    try {
      await apiRequest("/api/v1/auth", "POST", {
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      router.push("/verify-account");
    } catch (error) {
      console.error("サインアップエラー", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">サインアップ</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField type="email" placeholder="メールアドレス" name="email" required />
        <InputField type="password" placeholder="パスワード" name="password" required />
        <InputField type="password" placeholder="パスワード確認用" name="password_confirmation" required />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "処理中..." : "サインアップ"}
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
