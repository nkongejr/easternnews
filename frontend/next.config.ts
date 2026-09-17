import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remote hosts the CMS is allowed to serve images from.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
