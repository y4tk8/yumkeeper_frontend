"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { apiRequest } from "@/lib/apiClient";
import { AuthContext } from "@/contexts/AuthContext";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import Button from "@/components/ui/Button";

interface GuestUser {
  id: number;
  email: string;
  username: null;
  allow_password_change: false;
  is_deleted: false;
  role: "ゲスト";
  provider: "email";
  uid: string;
  last_login_at: null;
  created_at: string;
  updated_at: string;
}

interface GuestSignInResponse {
  message: string;
  user: GuestUser;
}

interface GuestSignInDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function GuestSignInDialog({ open, onClose }: GuestSignInDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { handleClientError } = useClientErrorHandler();

  // ゲストサインイン処理
  const handleGuestSignIn = async () => {
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      const res = await apiRequest<GuestSignInResponse>("/api/v1/auth/guest_user", "POST");

      if (res.ok) {
        // Devise Token Auth の認証情報を Context に追加
        authContext?.setAuthHeaders({
          accessToken: res.headers.get("access-token") || "",
          client: res.headers.get("client") || "",
          uid: res.headers.get("uid") || "",
        });

        // ユーザーIDを Context に追加
        const userId = res.data.user.id;
        authContext?.setUserId(userId);

        // role: "ゲスト" を Context に追加
        const userRole = res.data.user.role;
        authContext?.setUserRole(userRole);

        showSuccessToast("ログインしました");
        onClose(); // モーダルを閉じる
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
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="bg-white p-8 rounded-md max-w-md w-full shadow-md">
          <DialogTitle className="text-lg font-semibold mb-6">ゲストログイン</DialogTitle>

          <div className="text-sm text-gray-600">
            <ul className="list-disc pl-5 space-y-1">
              <li>すべての機能を利用可能です</li>
              <li>終了する場合、ページ右上の<span className="underline">ゲスト</span>から「ログアウト」を選択してください</li>
              <li>ログアウトすると保存したすべてのレシピは破棄されます</li>
            </ul>
          </div>

          <div className="flex justify-between mt-12">
            <Button variant="outline" onClick={onClose}>キャンセル</Button>
            <Button onClick={handleGuestSignIn} disabled={isSubmitting}>
              {isSubmitting ? "処理中..." : "ログイン"}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
