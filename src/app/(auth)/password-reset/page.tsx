"use client";

import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/components/ui/shadcn/sonner";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const PasswordResetPage = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { request } = useApiClient();
  const { handleClientError } = useClientErrorHandler();
  const router = useRouter();

  // パスワードリセット処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    // NOTE: リセットメール内のリンク押下で遷移先ページURLに `reset_password_token` が自動付与される
    // APIリクエストに含めるリセットトークンを取得
    const params = new URLSearchParams(window.location.search);
    const resetPasswordToken = params.get("reset_password_token");

    if (!resetPasswordToken) {
      showErrorToast("予期せぬエラーが発生しました。お手数ですが、再度お試しください。");

      setIsSubmitting(false);
      setPassword("");
      setPasswordConfirmation("");
      router.push("/");
    }

    const payload = {
      password,
      password_confirmation: passwordConfirmation,
      reset_password_token: resetPasswordToken,
    };

    try {
      const res = await request("/api/v1/auth/password", "PUT", payload);

      if (res.ok) {
        showSuccessToast("パスワードがリセットされました");

        setPassword("");
        setPasswordConfirmation("");
        router.push("/");
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
