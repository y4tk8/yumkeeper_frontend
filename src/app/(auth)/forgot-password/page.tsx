"use client";

import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // パスワードリセットメール送信のイベントハンドラー
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("パスワードリセットメールを送信しました。");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">パスワードリセット</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* 注意事項 */}
      <div className="text-sm text-gray-600 space-y-2">
        <ul className="list-disc pl-5">
          <li>リセットメール送信先のメールアドレスを入力してください。</li>
          <li>「yumkeeper@example.com」からのメールが受信できるようにしてください。</li>
        </ul>
      </div>

      <div className="text-right">
        <Link href="/signin" className="text-blue-600 hover:underline">
          サインインはこちら
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
