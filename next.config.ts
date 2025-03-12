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
    }
  },
  // Skip static generation during build if environment variable is set
  staticPageGenerationTimeout: 120,
  generateStaticParams: process.env.SKIP_BUILD_STATIC_GENERATION === 'true' ? () => [] : undefined,
};

export default nextConfig;
