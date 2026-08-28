import type { NextConfig } from 'next';

const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
let wpHostname = '';
try {
  if (wpUrl) {
    wpHostname = new URL(wpUrl).hostname;
  }
} catch {
  // Bỏ qua nếu URL không hợp lệ lúc build
}

const nextConfig: NextConfig = {
  output: 'standalone',
  staticPageGenerationTimeout: 180,
  reactStrictMode: true,
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1, // Sử dụng 1 CPU core khi build để nhường tài nguyên cho MySQL/aaPanel
    staticGenerationMaxConcurrency: 1, // Giới hạn sinh tối đa 1 trang cùng lúc để tránh quá tải WordPress
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 năm để giảm tải tối đa CPU máy chủ
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      ...(wpHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: wpHostname,
            },
            {
              protocol: 'http' as const,
              hostname: wpHostname,
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: '**.edu.vn',
      },
      {
        protocol: 'https',
        hostname: '**.homenest.vn',
      },
      {
        protocol: 'https',
        hostname: '**.homenest.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'c.animaapp.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Cache static assets trong 1 năm
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache ảnh public trong 1 tuần
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      {
        // Cache fonts trong 1 năm
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
