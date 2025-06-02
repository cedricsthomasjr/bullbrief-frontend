import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/market",
        destination: "http://localhost:8000/api/market", // Flask backend route
      },
    ];
  },
};

export default nextConfig;
