"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "@/components/ui/Button";

export default function VideoEmbedBlock() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const handleConfirmUrl = async () => {
    try {
      // URLをパース（v=XXX を抜き出して iframe URL に変換）
      const videoId = new URL(videoUrl).searchParams.get("v");

      if (!videoId) throw new Error("無効なURLです");

      // YouTube APIへのリクエスト。後で。

      const embedURL = `https://www.youtube.com/embed/${videoId}`;
      setIframeUrl(embedURL);

      setIsOpen(false);
    } catch (e) {
      alert("URLの形式が正しくありません");
      console.error(e);
    }
  };

  return (
    <div className="w-full h-60 border border-black rounded-md flex flex-col justify-center items-center gap-4">
      {iframeUrl ? (
        <iframe
          width="100%"
          height="100%"
          src={iframeUrl}
          title="YouTube Video"
          allowFullScreen
          className="rounded-md"
        />
      ) : (
        <>
          <Button onClick={handleOpenModal}>URLを指定する</Button>
          <Button variant="outline" onClick={() => window.open("https://www.youtube.com", "_blank")}>
            新しいタブでYouTubeを開く
          </Button>
        </>
      )}

      {/* モーダル */}
      <Dialog open={isOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white p-6 rounded-md space-y-4 max-w-md w-full shadow-md">
            <DialogTitle className="text-lg font-semibold">URLを入力してください</DialogTitle>
            <input
              type="text"
              placeholder="https://www.youtube.com"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleCloseModal}>
                キャンセル
              </Button>
              <Button onClick={handleConfirmUrl}>OK</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
