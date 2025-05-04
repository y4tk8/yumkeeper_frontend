"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";
import { AuthContext } from "@/contexts/AuthContext";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { showSuccessToast } from "@/components/ui/shadcn/sonner";
import Button from "@/components/ui/Button";

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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="space-y-10">
        <h2 className="text-xl font-semibold">退会</h2>

        <div>
          <p className="text-gray-700 text-sm mb-1">
            退会するとアカウントに紐づく全てのデータが削除され、二度と復元できません。
          </p>
          <p className="text-gray-700 text-sm">
            同意する場合は、下記にチェックを入れた上で退会手続きを進めてください。
          </p>
        </div>

        <div className="flex items-center">
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

        <Button
          variant="destructive"
          fullWidth
          onClick={handleOpenModal}
          disabled={!isChecked}
        >
          退会する
        </Button>
      </div>

      {/* 退会モーダル */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center">
            <DialogPanel className="bg-white p-8 rounded-md max-w-md w-full shadow-md">
              <DialogTitle className="text-lg font-semibold">本当に退会しますか？</DialogTitle>
              <div className="flex justify-between mt-12">
                <Button variant="outline" onClick={handleCloseModal}>キャンセル</Button>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSubmitting}>
                  退会する
                </Button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default DeleteAccountPage;
