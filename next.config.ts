import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback. The source art is large PNG; letting
    // next/image re-encode keeps the transferred bytes small.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
