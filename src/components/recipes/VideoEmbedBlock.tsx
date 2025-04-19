"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { YouTubeVideoInfo } from "@/types/video";
import { MinusCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface VideoProps {
  videoInfo: YouTubeVideoInfo | null;
  setVideoInfo: React.Dispatch<React.SetStateAction<YouTubeVideoInfo | null>>;
}

export default function VideoEmbedBlock({ videoInfo, setVideoInfo }: VideoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  // YouTube Data API へリクエストを送る関数
  const fetchVideoInfo = async (videoId: string): Promise<YouTubeVideoInfo | null> => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,status`;

    const res = await fetch(endpoint);
    const json = await res.json();

    const item = json.items?.[0];
    if (!item) return null;

    return {
      video_id: videoId,
      etag: item.etag,
      thumbnail_url: item.snippet.thumbnails?.medium?.url ?? "",
      status: item.status.privacyStatus,
      is_embeddable: item.status.embeddable,
      is_deleted: false,
      cached_at: new Date().toISOString(),
    };
  };

  // 入力したURLの動画情報を取得する関数
  const handleConfirmUrl = async () => {
    const videoId = new URL(videoUrl).searchParams.get("v"); // URLをパース（v=XXX を抜き出して iframe URL に変換）

    if (!videoId) {
      alert("無効なURLです");
      return;
    }

    try {
      const info = await fetchVideoInfo(videoId);

      if (!info) {
        alert("動画が見つかりませんでした");
        return;
      }

      if (!info.is_embeddable) {
        alert("この動画は埋め込みできません");
        return;
      }

      if (info.status === "private") {
        alert("この動画は非公開です");
        return;
      }

      setVideoInfo(info);

      setIsOpen(false);
    } catch (e) {
      alert("動画情報の取得中にエラーが発生しました");
      console.error(e);
    }
  };

  return (
    <div className="w-full h-64 border border-black rounded-md flex flex-col justify-center items-center gap-4">
      {videoInfo ? (
        <div className="relative w-full h-full">
          {/* 削除ボタン */}
          <button
            onClick={() => setVideoInfo(null)}
            className="absolute top-0 left-0 translate-x-[-50%] translate-y-[-50%] z-10"
            aria-label="動画を削除"
          >
            <MinusCircle className="text-red-500"/>
          </button>

          {/* YouTube iframe */}
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoInfo.video_id}`}
            title="YouTube Video"
            allowFullScreen
            className="rounded-md"
          />
        </div>
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
              <Button variant="outline" onClick={handleCloseModal}>キャンセル</Button>
              <Button onClick={handleConfirmUrl}>OK</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
