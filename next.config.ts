import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy API requests to Express backend during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
