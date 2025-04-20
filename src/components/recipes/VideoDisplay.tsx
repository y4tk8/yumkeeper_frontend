import { Video } from "@/types/video";

interface VideoDisplayProps {
  video: Video | null;
}

export default function VideoDisplay({ video }: VideoDisplayProps) {
  if (!video) return null;

  return (
    <div className="w-full aspect-video rounded-md overflow-hidden shadow">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${video.video_id}`}
        title="YouTube Video"
        allowFullScreen
      />
    </div>
  );
}
