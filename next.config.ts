import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.ytimg.com"], // YouTubeのサムネイル画像のドメインを許可
  },
};

export default nextConfig;
