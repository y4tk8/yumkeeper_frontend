import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com", // YouTubeのサムネイル画像のドメインを許可
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
