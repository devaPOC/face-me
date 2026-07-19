import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['10.171.250.134'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*'
      },
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8080/ws/:path*'
      }
    ];
  }
}

export default nextConfig;
