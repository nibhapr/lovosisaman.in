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
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  }
};

export default nextConfig;
