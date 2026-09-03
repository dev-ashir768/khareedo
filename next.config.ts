import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oms.getorio.com",
      },
    ],
  },
};

export default nextConfig;
