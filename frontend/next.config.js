/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: process.env.BASE_PATH || undefined,
  reactStrictMode: true,
  
  // Performance optimizations
  swcMinify: true,
  images: {
    domains: ['localhost', 'www.swufe.tech', 'swufe.tech', 'class.swufe.chat'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Compression
  compress: true,
  
  // Disable problematic optimizations for compatibility
  experimental: {
    scrollRestoration: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  async redirects() {
    return [];
  },
  async rewrites() {
    if (process.env.REMOTE_URL) {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.REMOTE_URL}/api/:path*/`,
        },
        {
          source: "/oauth/:path*",
          destination: `${process.env.REMOTE_URL}/oauth/:path*/`,
        },
        {
          source: "/upload/:path*",
          destination: `${process.env.REMOTE_URL}/upload/:path*/`,
        },
        {
          source: "/static/:path*",
          destination: `${process.env.REMOTE_URL}/static/:path*/`,
        },
      ];
    } else return [];
  },
  transpilePackages: ['ahooks']
};

module.exports = nextConfig;
