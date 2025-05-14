"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import GuestSignInDialog from "@/components/auth/GuestSignInDialog";

interface SignUpErrorResponse {
  email?: string[];
  password?: string[];
  password_confirmation?: string[];
}

export default function SingUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<SignUpErrorResponse>({});
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const { request } = useApiClient();
  const { handleClientError } = useClientErrorHandler();
  const router = useRouter();

  // サインアップ処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);
    setFieldErrors({});

    const payload = {
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      const res = await request("/api/v1/auth", "POST", payload);

      if (res.ok) {
        showSuccessToast("アカウント認証メールを送信しました");
        router.push("/verify-account");
      } else {
        if (res.status === 422) {
          const errors = res.data?.errors as SignUpErrorResponse;

          setFieldErrors({
            email: errors.email ?? [],
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
    <>
      <div className="space-y-10">
        <h2 className="text-xl font-semibold">登録する</h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <InputField
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: [] }));
              }}
              required
              errorMessages={fieldErrors.email}
            />
            <InputField
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) =>{
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: [] }));
              }}
              required
              errorMessages={fieldErrors.password}
            />
            <InputField
              type="password"
              placeholder="パスワード確認用"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password_confirmation: [] }));
              }}
              required
              errorMessages={fieldErrors.password_confirmation}
            />
          </div>

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "処理中..." : "登録する（無料）"}
          </Button>
        </form>
      </div>

      <div className="space-y-10">
        <div className="flex justify-between text-sm mt-4">
          <span>アカウントをお持ちですか？</span>
          <Link href="/signin" className="text-blue-600 hover:underline">
            ログインはこちら
          </Link>
        </div>

        {/* 区切り線 */}
        <div className="relative">
          <span className="absolute inset-x-8 h-px bg-gray-300"></span>
        </div>

        <Button
          type="button"
          variant="guest"
          fullWidth
          onClick={() => setIsGuestModalOpen(true)}
        >
          ゲストとして使ってみる
        </Button>
      </div>

      {/* ゲストサインインモーダル */}
      <GuestSignInDialog
        open={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </>
  );
}
