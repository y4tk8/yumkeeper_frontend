"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { useErrorToast } from "@/hooks/useErrorToast";
import { apiRequest } from "@/lib/apiClient";
import { AuthContext } from "@/contexts/AuthContext";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import GuestSignInDialog from "@/components/auth/GuestSignInDialog";

interface SignInResponse {
  data: {
    id: number;
    email: string;
    username: string | null;
    allow_password_change: boolean;
    is_deleted: false;
    role: string;
    provider: "email";
    uid: string;
    last_login_at: string | null;
  }
}

export default function SingInPage() {
  useErrorToast(); // 未認証でリダイレクトされてきた場合 -> エラートースト表示

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { handleClientError } = useClientErrorHandler();

  // サインイン処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const res = await apiRequest<SignInResponse | { errors: string[] }>(
        "/api/v1/auth/sign_in",
        "POST",
        { email, password }
      );

      if (res.ok) {
        // サインイン成功 -> Devise Token Auth の認証情報がレスポンスヘッダーに返る
        // 毎回のAPIリクエストで使えるよう Context に追加
        authContext?.setAuthHeaders({
          accessToken: res.headers.get("access-token") || "",
          client: res.headers.get("client") || "",
          uid: res.headers.get("uid") || "",
        });

        // ユーザーIDを Context に追加
        const userId = (res.data as SignInResponse).data.id;
        authContext?.setUserId(userId);

        showSuccessToast("ログインしました");
        router.push("/");
      } else {
        const resBody = res.data as { errors?: string[] };

        if (resBody.errors && resBody.errors.length > 0) {
          setAuthError(resBody.errors[0]);
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
        <h2 className="text-xl font-semibold">ログイン</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAuthError(null);
              }}
              required
            />

            <InputField
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError(null);
              }}
              required
            />
            {authError && (
              <p className="text-sm text-red-600">{authError}</p>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-4 mb-10">
            <Link href="/password-forgot" className="text-blue-600 hover:underline">
              パスワードをお忘れですか？
            </Link>
          </p>

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "処理中..." : "ログイン"}
          </Button>
        </form>
      </div>

      <div className="space-y-10">
        <div className="flex justify-between text-sm mt-4">
          <span>アカウントをお持ちではないですか？</span>
          <Link href="/signup" className="text-blue-600 hover:underline">
            新規登録はこちら
          </Link>
        </div>

        {/* 区切り線 */}
        <div className="relative">
          <div className="absolute inset-x-8 h-px bg-gray-300"></div>
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
