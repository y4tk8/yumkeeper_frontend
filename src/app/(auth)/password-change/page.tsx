"use client";

import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const PasswordChangePage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 現在のパスワード変更のイベントハンドラー
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("パスワードが変更されました。");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">パスワード変更</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          type="password"
          placeholder="現在のパスワード"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="新しいパスワード"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="新しいパスワード確認用"
          value={newPasswordConfirmation}
          onChange={(e) => setNewPasswordConfirmation(e.target.value)}
          required
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "変更中..." : "変更する"}
        </Button>
      </form>
    </div>
  );
};

export default PasswordChangePage;
