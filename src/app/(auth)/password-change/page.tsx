"use client";

import { useState } from "react";
import { useApiClient } from "@/lib/api/useApiClient";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const PasswordChangePage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { request } = useApiClient();

  // 現在のパスワード変更処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      const res = await request("/api/v1/auth/", "PUT", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });
      alert("パスワードが変更されました。");
    } catch (error) {
      console.error("パスワード変更エラー", error);
    } finally {
      setIsSubmitting(false);
    }
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
