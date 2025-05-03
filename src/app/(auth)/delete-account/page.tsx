"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { AuthContext } from "@/contexts/AuthContext";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";

const DeleteAccountPage = () => {
  useRequireAuth(); // 未認証ならリダイレクト

  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { request } = useApiClient();
  const { handleClientError } = useClientErrorHandler();

  // アカウント退会処理
  const handleDeleteAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    setIsSubmitting(true);

    try {
      const res = await request("/api/v1/auth", "DELETE");

      if (res.ok) {
        authContext?.setAuthHeaders(null); // Context と ローカルストレージ の認証情報をクリア

        showSuccessToast("退会処理が完了しました。ご利用ありがとうございました。");
        router.push("/");
      } else {
        handleClientError(res.status, "退会処理に失敗しました。しばらくしてから再試行してください。");
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.error("APIエラー:", e);
      }
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-md border border-gray-300 shadow-sm text-center">
        <h2 className="text-xl font-semibold mb-6 text-left">退会</h2>
        <p className="text-gray-700 text-sm mb-4 text-left">
          退会するとアカウントに紐づく全てのデータが削除され、二度と復元できません。同意する場合は、下記にチェックを入れた上で退会手続きを進めてください。
        </p>
        <div className="flex items-center mb-6 text-left">
          <input
            type="checkbox"
            id="agree"
            className="mr-2 w-4 h-4"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <label htmlFor="agree" className="text-gray-700 text-sm">
            同意する
          </label>
        </div>
        <button
          className={`w-full py-2 rounded-md text-white transition ${
            isChecked
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursol-not-allowed"
          }`}
          disabled={!isChecked}
          onClick={() => setIsModalOpen(true)}
        >
          退会する
        </button>
      </div>

      {/* 退会モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80 text-center">
            <p className="text-lg font-semibold mb-4">本当に退会しますか？</p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-400 rounded-md text-white hover:bg-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                いいえ
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700"
                onClick={handleDeleteAccount}
                disabled={isSubmitting}
              >
                {isSubmitting ? "処理中..." : "はい"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountPage;
