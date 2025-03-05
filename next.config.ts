import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lovosis.in'
      },
      {
        protocol: 'https',
        hostname: 'www.lovosis.in'
      }
    ]
  },
  output: 'standalone'
};

export default nextConfig;
