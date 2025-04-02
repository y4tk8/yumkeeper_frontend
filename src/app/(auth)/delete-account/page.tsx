"use client";

import { useState } from "react";

const DeleteAccountPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 退会処理のイベントハンドラー
  // NOTE: 後でfetch処理完成させる
  const handleDeleteAccount = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("", {
        method: "DELETE",
        headers: {}
      });
      const data = await response.json();
      alert(data.message || "退会処理が完了しました。ご利用ありがとうございました。");
    } catch {
      alert("退会処理に失敗しました。しばらくしてから再試行してください。");
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

      {/* モーダル */}
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
