"use client";

import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

interface PasswordChangeErrorResponse {
  current_password?: string[];
  password?: string[];
  password_confirmation?: string[];
}

const PasswordChangePage = () => {
  useRequireAuth(); // 未認証ならリダイレクト

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<PasswordChangeErrorResponse>({});

  const { request } = useApiClient();
  const { handleClientError } = useClientErrorHandler();

  // 現在のパスワード変更処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const payload = {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      };

      const res = await request("/api/v1/auth/", "PUT", payload);

      if (res.ok) {
        showSuccessToast("パスワードが変更されました");

        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
      } else {
        if (res.status === 422) {
          const errors = res.data?.errors as PasswordChangeErrorResponse;

          setFieldErrors({
            current_password: errors.current_password ?? [],
            password: errors.password ?? [],
            password_confirmation: errors.password_confirmation ?? [],
          });
        } else {
          handleClientError(res.status);
        }
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
    <div className="space-y-10">
      <h2 className="text-xl font-semibold">パスワード変更</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <InputField
            type="password"
            placeholder="現在のパスワード"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, current_password: [] }));
            }}
            required
            errorMessages={fieldErrors.current_password}
          />
          <InputField
            type="password"
            placeholder="新しいパスワード"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: [] }));
            }}
            required
            errorMessages={fieldErrors.password}
          />
          <InputField
            type="password"
            placeholder="新しいパスワード確認用"
            value={newPasswordConfirmation}
            onChange={(e) => {
              setNewPasswordConfirmation(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password_confirmation: [] }));
            }}
            required
            errorMessages={fieldErrors.password_confirmation}
          />
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "変更中..." : "変更する"}
        </Button>
      </form>
    </div>
  );
};

export default PasswordChangePage;
