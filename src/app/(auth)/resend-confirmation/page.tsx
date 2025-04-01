"use client";

import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const ResendConfirmationPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // アカウント認証メール再送のイベントハンドラー
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("アカウント認証メールを再送しました。");
    }, 2000);
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
