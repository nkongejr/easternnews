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
  allowedDevOrigins: ["*"],
  async rewrites() {
    // Dev/preview only: browser calls same-origin /api, Next proxies to Express.
    // Production on Vercel keeps NEXT_PUBLIC_API_URL pointed at the live API.
    if (process.env.NODE_ENV === "production" && !process.env.API_INTERNAL_URL) {
      return [];
    }
    const base = (process.env.API_INTERNAL_URL || "http://127.0.0.1:5000/api").replace(
      /\/api\/?$/,
      "",
    );
    return [{ source: "/api/:path*", destination: `${base}/api/:path*` }];
  },
};

export default nextConfig;
