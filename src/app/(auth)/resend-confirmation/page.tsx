"use client";

import { useState } from "react";
import { useApiClient } from "@/lib/useApiClient";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const ResendConfirmationPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiClient = useApiClient();

  // アカウント認証メール再送処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      await apiClient("/api/v1/auth/confirmation", "POST", { email });
      alert("アカウント認証メールが再送されました。");
    } catch (e) {
      console.error("アカウント認証メール再送エラー", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">アカウント認証メール再送</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "送信中..." : "アカウント認証メールを再送"}
        </Button>
      </form>

      {/* 注意事項 */}
      <div className="text-sm text-gray-600 space-y-2">
        <ul className="list-disc pl-5">
          <li>再送先のメールアドレスが正しいことを確認の上、ご入力ください。</li>
          <li><span className="font-semibold">yumkeeper@example.com</span> からのメールが受信できるようにしてください。</li>
        </ul>
      </div>
    </div>
  );
};

export default ResendConfirmationPage;
