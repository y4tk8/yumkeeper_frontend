import { Video } from "@/types/video";

interface VideoDisplayProps {
  video: Video | null;
}

export default function VideoDisplay({ video }: VideoDisplayProps) {
  return (
    <div className="w-full aspect-video rounded-md overflow-hidden shadow flex items-center justify-center bg-white border border-gray-400">
      {video ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.video_id}`}
          title="YouTube Video"
          allowFullScreen
        />
      ) : (
        <p className="text-gray-500 text-lg">動画はありません</p>
      )}
    </div>
  );
}
