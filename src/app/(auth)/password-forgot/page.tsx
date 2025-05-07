"use client";

import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const PasswordForgotPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { request } = useApiClient();
  const { handleClientError } = useClientErrorHandler();

  // パスワードリセットメール送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      const res = await request("/api/v1/auth/password", "POST", { email });

      if (res.ok) {
        showSuccessToast("パスワードリセットメールが送信されました");

        setEmail("");
      } else {
        handleClientError(res.status);
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.error("APIエラー:", e);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-10">
        <h2 className="text-xl font-semibold">パスワードリセット</h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <InputField
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "パスワードリセットメールを送信"}
          </Button>
        </form>
      </div>

      {/* 注釈 */}
      <div className="text-sm text-gray-600 mt-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>送信先のメールアドレスが正しいことを確認の上、ご入力ください。</li>
          <li><span className="font-semibold">yumkeeper@example.com</span> からのメールが受信できるようにしてください。</li>
        </ul>
      </div>

      <div className="text-right mt-4">
        <Link href="/signin" className="text-blue-600 hover:underline">
          ログインはこちら
        </Link>
      </div>
    </>
  );
};

export default PasswordForgotPage;
