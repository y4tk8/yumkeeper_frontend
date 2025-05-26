"use client";

import { useState } from "react";
import { MinusCircle } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Video, VideoWithoutId } from "@/types/video";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

interface VideoProps {
  videoInfo: Video | null;
  setVideoInfo: React.Dispatch<React.SetStateAction<Video | null>>;
  onDelete?: () => void;
  onReplace?: (newVideo: VideoWithoutId) => void;
}

export default function VideoEmbedBlock({ videoInfo, setVideoInfo, onDelete, onReplace }: VideoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoErrors, setVideoErrors] = useState<string[]>([]);

  // YouTube Data API へリクエストを送る関数
  const fetchVideoInfo = async (videoId: string): Promise<Video | null> => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,status`;

    const res = await fetch(endpoint);
    const json = await res.json();

    const item = json.items?.[0];
    if (!item) return null;

    return {
      video_id: videoId,
      etag: item.etag,
      thumbnail_url: item.snippet.thumbnails?.high?.url
                  ?? item.snippet.thumbnails?.medium?.url
                  ?? "",
      status: item.status.privacyStatus,
      is_embeddable: item.status.embeddable,
      is_deleted: false,
      cached_at: new Date().toISOString(),
    };
  };

  // 入力したURLの動画情報を取得する関数
  const handleConfirmUrl = async () => {
    setVideoErrors([]);

    if (videoUrl.trim() === "") {
      setVideoErrors(["URLを入力してください"]);
      return;
    }

    let videoId: string | null;

    try {
      // URLをパース（v=XXX を抜き出して iframe URL に変換）
      const parsedURL = new URL(videoUrl);
      videoId = parsedURL.searchParams.get("v");

      if (!videoId) {
        setVideoErrors(["無効なYouTube動画URLです"]);
        return;
      }
    } catch {
      setVideoErrors(["無効なURL形式です"]);
      return;
    }

    try {
      const info = await fetchVideoInfo(videoId);

      if (!info) {
        setVideoErrors(["動画が見つかりませんでした"]);
        return;
      }

      if (!info.is_embeddable) {
        setVideoErrors(["この動画は埋め込みが許可されていません"]);
        return;
      }

      if (info.status === "private") {
        setVideoErrors(["この動画は非公開です"]);
        return;
      }

      // 既存動画あり -> 差し替え / 既存動画なし -> 新しくセット
      if (videoInfo?.id) {
        onReplace?.(info);
      } else {
        setVideoInfo(info);
      }

      setIsModalOpen(false);
      setVideoUrl("");
    } catch (e) {
      setVideoErrors(["動画の取得中にエラーが発生しました"]);

      if (process.env.NODE_ENV !== "production") {
        console.error("APIエラー:", e)
      }
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setVideoErrors([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVideoUrl("");
    setVideoErrors([]);
  };

  return (
    <div className="w-full aspect-video flex flex-col items-center justify-center bg-white border border-gray-400 rounded-md shadow relative">
      {videoInfo && !videoInfo._destroy ? (
        <div className="relative w-full h-full">
          {/* 削除ボタン */}
          <div className="absolute top-0 left-0">
            <button
              onClick={() => videoInfo?.id ? onDelete?.() : setVideoInfo(null)}
              className="translate-x-[-50%] translate-y-[-50%] z-10"
              aria-label="動画を削除"
            >
              <MinusCircle className="text-red-500 w-8 h-8"/>
            </button>
          </div>

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
        <div className="flex flex-col items-center justify-center gap-8">
          <Button variant="secondary" onClick={handleOpenModal}>URLを指定する</Button>
          <Button variant="outline" onClick={() => window.open("https://www.youtube.com", "_blank")}>
            新しいタブでYouTubeを開く
          </Button>
        </div>
      )}

      {/* URL指定モーダル */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <DialogPanel className="bg-white p-8 rounded-md max-w-md w-full shadow-md">
            <DialogTitle className="text-lg font-semibold mb-4">URLを入力してください</DialogTitle>

            <InputField
              type="text"
              placeholder="https://www.youtube.com"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              errorMessages={videoErrors}
            />

            <p className="text-sm text-gray-400 pt-2">※ショート動画は指定できません</p>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleCloseModal}>キャンセル</Button>
              <Button variant="secondary" onClick={handleConfirmUrl}>OK</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
