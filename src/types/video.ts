// YouTube Data API から取得した動画情報
export interface YouTubeVideoInfo {
  video_id: string;
  etag: string;
  thumbnail_url: string;
  status: "public" | "private" | "unlisted";
  is_embeddable: boolean;
  is_deleted: boolean;
  cached_at: string;
}
