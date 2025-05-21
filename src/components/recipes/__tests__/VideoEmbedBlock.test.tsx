import { describe, expect, it, vi, beforeEach, beforeAll, afterEach, afterAll } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import VideoEmbedBlock from "@/components/recipes/VideoEmbedBlock";
import React, { act, useState } from "react";
import { Video } from "@/types/video";

const mockSetVideoInfo = vi.fn();
const mockOnReplace = vi.fn();
const mockOnDelete = vi.fn();

const VALID_VIDEO_ID = "abc123";

const server = setupServer(
  http.get("https://www.googleapis.com/youtube/v3/videos", ({ request }) => {
    const url = new URL(request.url);
    const videoId = url.searchParams.get("id");

    if (videoId === "notfound") {
      return HttpResponse.json({ items: [] });
    }

    return HttpResponse.json({
      items: [
        {
          etag: "test-etag",
          snippet: {
            thumbnails: {
              high: { url: "https://example.com/thumb.jpg" },
            },
          },
          status: {
            embeddable: true,
            privacyStatus: "public",
          },
        },
      ],
    },
    { status: 200 }
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  cleanup();
});
afterAll(() => server.close());

const renderAndOpenModal = async (props = {}) => {
  render(
    <VideoEmbedBlock
      videoInfo={null}
      setVideoInfo={mockSetVideoInfo}
      {...props}
    />
  );

  await userEvent.click(screen.getByRole("button", { name: "URLを指定する" }));
};

describe("VideoEmbedBlockコンポーネント", () => {
  describe("モーダルの基本動作", () => {
    it("モーダルが表示される", async () => {
      await renderAndOpenModal();
      expect(screen.getByText("URLを入力してください")).toBeInTheDocument();
    });
  });

  describe("URLバリデーションメッセージの表示", () => {
    beforeEach(async () => {
      await renderAndOpenModal();
    });

    it("URLが空ならエラー", async () => {
      await userEvent.click(screen.getByRole("button", { name: "OK" }));

      expect(await screen.findByRole("error")).toHaveTextContent("URLを入力してください");
    });

    it("不正なURL形式ならエラー", async () => {
      const input = screen.getByPlaceholderText("https://www.youtube.com");
      await userEvent.type(input, "invalid-url");
      await userEvent.click(screen.getByRole("button", { name: "OK" }));

      expect(await screen.findByText("無効なURL形式です")).toBeInTheDocument();
    });

    it("videoIdが取得できないURLならエラー", async () => {
      const input = screen.getByPlaceholderText("https://www.youtube.com");
      await userEvent.type(input, "https://www.youtube.com/watch");
      await userEvent.click(screen.getByRole("button", { name: "OK" }));

      expect(await screen.findByRole("error")).toHaveTextContent("無効なYouTube動画URLです");
    });
  });

  describe("YouTube Data APIからエラーレスポンス取得", () => {
    beforeEach(async () => {
      await renderAndOpenModal();
    });

    it("動画取得に失敗", async () => {
      const input = screen.getByPlaceholderText("https://www.youtube.com");
      await userEvent.type(input, "https://www.youtube.com/watch?v=notfound");
      await userEvent.click(screen.getByRole("button", { name: "OK" }));

      expect(await screen.findByRole("error")).toHaveTextContent("動画が見つかりませんでした");
    });

    it("動画埋め込みが許可されていない", async () => {
      server.use(
        http.get("https://www.googleapis.com/youtube/v3/videos", () =>
          HttpResponse.json(
            {
              items: [
                {
                  etag: "test-etag",
                  snippet: {
                    thumbnails: {
                      high: { url: "https://example.com/thumb.jpg" },
                    },
                  },
                  status: {
                    embeddable: false, // 埋め込み未許可
                    privacyStatus: "public",
                  },
                },
              ],
            },
            { status: 200 }
          )
        )
      );

      const input = screen.getByPlaceholderText("https://www.youtube.com");
      await userEvent.type(input, "https://www.youtube.com/watch?v=cannot_embeddable");
      await userEvent.click(screen.getByRole("button", { name: "OK" }));

      expect(await screen.findByRole("error")).toHaveTextContent("この動画は埋め込みが許可されていません");
    });

    it("動画が非公開", async () => {
      server.use(
        http.get("https://www.googleapis.com/youtube/v3/videos", () =>
          HttpResponse.json(
            {
              items: [
                {
                  etag: "test-etag",
                  snippet: {
                    thumbnails: {
                      high: { url: "https://example.com/thumb.jpg" },
                    },
                  },
                  status: {
                    embeddable: true,
                    privacyStatus: "private", // 非公開
                  },
                },
              ],
            },
            { status: 200 }
          )
        )
      );

      const input = screen.getByPlaceholderText("https://www.youtube.com");
      await userEvent.type(input, "https://www.youtube.com/watch?v=private");
      await userEvent.click(screen.getByRole("button", { name: "OK" }));

      expect(await screen.findByRole("error")).toHaveTextContent("この動画は非公開です");
    });
  });

  describe("正常ケースとイベントハンドラ", () => {
    it("正常なURLならsetVideoInfoが呼ばれる", async () => {
      await renderAndOpenModal();
      const input = screen.getByPlaceholderText("https://www.youtube.com");
      await userEvent.type(input, `https://www.youtube.com/watch?v=${VALID_VIDEO_ID}`);
      await userEvent.click(screen.getByRole("button", { name: "OK" }));

      await waitFor(() => {
        expect(mockSetVideoInfo).toHaveBeenCalled();
      });
    });

    it("既存動画があればonReplaceが呼ばれる", async () => {
      let externalSetVideoInfo: React.Dispatch<React.SetStateAction<Video | null>>;

      const Wrapper = () => {
        const [videoInfo, setVideoInfo] = useState<Video | null>({
          id: 1,
          video_id: "old123",
          etag: "",
          thumbnail_url: "",
          status: "public",
          is_embeddable: true,
          is_deleted: false,
          cached_at: ""
        });

        externalSetVideoInfo = setVideoInfo; // setVideoInfoにアクセスできるよう別関数でエクスポーズ

        return (
          <VideoEmbedBlock
            videoInfo={videoInfo}
            setVideoInfo={setVideoInfo}
            onReplace={mockOnReplace}
          />
        );
      };

      render(<Wrapper />);

      const deleteButton = screen.getByLabelText("動画を削除");
      await userEvent.click(deleteButton);

      act(() => {
        externalSetVideoInfo((prev) => prev ? { ...prev, _destroy: true } : null);
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "URLを指定する" })).toBeInTheDocument();
      })

      await userEvent.click(screen.getByRole("button", { name: "URLを指定する" }));
      const input = screen.getByPlaceholderText("https://www.youtube.com");
      await userEvent.type(input, `https://www.youtube.com/watch?v=${VALID_VIDEO_ID}`);
      await userEvent.click(screen.getByRole("button", { name: "OK" }));

      await waitFor(() => {
        expect(mockOnReplace).toHaveBeenCalled();
      });
    });

    it("動画削除ボタンでonDeleteが呼ばれる", async () => {
      render(
        <VideoEmbedBlock
          videoInfo={{
            id: 1,
            video_id: "old123",
            etag: "",
            thumbnail_url: "",
            status: "public",
            is_embeddable: true,
            is_deleted: false,
            cached_at: ""
          }}
          setVideoInfo={mockSetVideoInfo}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByLabelText("動画を削除");
      await userEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });
});
