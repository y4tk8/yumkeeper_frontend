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

interface SignInResponse {
  data: {
    id: number;
    email: string;
    username: string | null;
    allow_password_change: boolean;
    is_deleted: boolean;
    role: string;
    last_login_at: string | null;
    provider: string;
    uid: string;
  }
}

export default function SingInPage() {
  useErrorToast(); // 未認証でリダイレクトされてきた場合 -> エラートースト表示

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { handleClientError } = useClientErrorHandler();

  // サインイン処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      const res = await apiRequest<SignInResponse>("/api/v1/auth/sign_in", "POST", { email, password });

      if (res.ok) {
        // サインイン成功 -> Devise Token Auth の認証情報がレスポンスヘッダーに返る
        // 毎回のAPIリクエストで使えるよう Context に追加
        authContext?.setAuthHeaders({
          accessToken: res.headers.get("access-token") || "",
          client: res.headers.get("client") || "",
          uid: res.headers.get("uid") || "",
        });

        // ユーザーIDを Context に追加
        const userId = res.data.data.id;
        authContext?.setUserId(userId);

        showSuccessToast("ログインしました");
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
      <h2 className="text-xl font-semibold">ログイン</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="text-sm text-gray-600">
          <Link href="/password-forgot" className="text-blue-600 hover:underline">
            パスワードをお忘れですか？
          </Link>
        </p>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "処理中..." : "ログイン"}
        </Button>
      </form>

      <div className="flex justify-between text-sm">
        <span>アカウントをお持ちではないですか？</span>
        <Link href="/signup" className="text-blue-600 hover:underline">
          新規登録はこちら
        </Link>
      </div>

      {/* 区切り線 */}
      <div className="relative y-6">
        <div className="absolute inset-x-4 top-1/2 h-px bg-gray-300"></div>
      </div>

      <Button type="button" variant="outline" fullWidth>
        ゲストとして使ってみる
      </Button>
    </div>
  );
}
