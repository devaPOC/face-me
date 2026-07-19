import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['10.171.250.134', 'kqrnt-157-50-146-230.free.pinggy.net'],
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
