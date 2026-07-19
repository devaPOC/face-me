import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['10.171.250.134', 'bjhvw-2409-40f0-440a-7abb-b8f7-889e-64fc-4edb.run.pinggy-free.link'],
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
