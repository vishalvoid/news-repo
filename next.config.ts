import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'newsapi.org',
      },
      {
        protocol: 'https',
        hostname: '**.cnn.com',
      },
      {
        protocol: 'https',
        hostname: '**.bbc.com',
      },
      {
        protocol: 'https',
        hostname: '**.theguardian.com',
      }
    ],
  },
};

export default nextConfig;
