"use client";

import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const PasswordResetPage = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, SetIsSubmitting] = useState(false);

  // パスワードリセットのイベントハンドラー
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    SetIsSubmitting(true);

    setTimeout(() => {
      SetIsSubmitting(false);
      alert("パスワードがリセットされました。");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">パスワードリセット</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          type="password"
          placeholder="新しいパスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="新しいパスワード確認用"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />

        <div className="pt-4">
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "パスワードをリセットする"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetPage;
