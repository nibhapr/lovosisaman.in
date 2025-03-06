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
    ],
    domains: ['localhost']
  },
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
