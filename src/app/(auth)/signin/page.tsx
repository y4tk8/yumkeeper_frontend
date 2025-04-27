"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useErrorToast } from "@/hooks/useErrorToast";
import { apiRequest } from "@/lib/apiClient";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function SingInPage() {
  useErrorToast(); // 未認証でリダイレクトされてきた場合 -> エラートースト表示

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // サインイン処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      const { data, headers } = await apiRequest("/api/v1/auth/sign_in", "POST", { email, password });

      // サインイン成功で Devise Token Auth の認証情報がレスポンスヘッダーに返る
      // 毎回のAPIリクエストで使えるよう Context に追加
      authContext?.setAuthHeaders({
        accessToken: headers.get("access-token") || "",
        client: headers.get("client") || "",
        uid: headers.get("uid") || "",
      });

      // サインイン成功でユーザーIDを取得と Context に追加
      const userId = (data as { data: { id: number } }).data.id;
      authContext?.setUserId(userId);

      router.push("/");
    } catch (error) {
      console.error("サインインエラー", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">サインイン</h2>

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
            パスワードを忘れた場合はこちら
          </Link>
        </p>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "処理中..." : "サインイン"}
        </Button>
      </form>

      <div className="flex justify-between text-sm">
        <span>アカウントをお持ちではないですか？</span>
        <Link href="/signup" className="text-blue-600 hover:underline">
          サインアップはこちら
        </Link>
      </div>

      {/* 区切り線 */}
      <div className="relative y-6">
        <div className="absolute inset-x-4 top-1/2 h-px bg-gray-300"></div>
      </div>

      <Button type="button" variant="outline" fullWidth>
        ゲストとしてサインインする
      </Button>
    </div>
  );
}
